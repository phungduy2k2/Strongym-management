import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  gender: Joi.boolean().required(),
  phone: Joi.string().pattern(/^[0]\d{9}$/).required(),
  imageUrl: Joi.string().optional(),
  address: Joi.string().required(),
  membershipPlanId: Joi.string().allow(null).optional(),
  status: Joi.string().required(),
  expiredDate: Joi.date().required(),
});

export const dynamic = "force-dynamic";

// get member by ID
export async function GET(req, { params }) {
  const authError = await authorize(req, ["manager", "member"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const member = await Member.findById(params.id); // .populate("membershipPlanId", "name")
    if (!member) {
      return NextResponse.json({
        success: false,
        message: messages.getAMember.NOT_FOUND,
      },{ status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: member,
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getAMember.ERROR,
    }, { status: 500 });
  }
}

//  update member
export async function PUT(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const { name, birth, gender, phone, address, membershipPlanId, status, expiredDate } = await req.json();   
    
    const { error } = schema.validate({ name, birth, gender, phone, address, membershipPlanId, status, expiredDate });
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      }, { status: 400 });
    }
    const updateMember = await Member.findByIdAndUpdate(params.id,
      { name, birth, gender, phone, address, membershipPlanId, status, expiredDate },
      { new: true }).populate("membershipPlanId", "name");
    if (!updateMember) {
      return NextResponse.json({
        success: false,
        message: messages.updateMember.NOT_FOUND,
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: messages.updateMember.SUCCESS,
      data: updateMember
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateMember.ERROR,
    }, { status: 500 });
  }
}

// delete member
export async function DELETE(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const deleteMember = await Member.findByIdAndDelete(params.id);
    if (!deleteMember) {
      return NextResponse.json({
        success: false,
        message: messages.deleteMember.NOT_FOUND,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: messages.deleteMember.SUCCESS,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteMember.ERROR,
    }, { status: 500 });
  }
}
