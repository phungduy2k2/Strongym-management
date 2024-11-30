import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  gender: Joi.string().required(),
  phone: Joi.string().pattern(/^[0]\d{9}$/).required(),
  imageUrl: Joi.string().optional(),
  address: Joi.string().required(),
  membershipPlanId: Joi.string().optional(),
  status: Joi.string().required(),
  expiredDate: Joi.date().required(),
});

export const dynamic = "force-dynamic";

// get all members
export async function GET() {
  try {
    await connectToDB();
    const allMembers = await Member.find({}).populate("membershipPlanId", "name");
    return NextResponse.json({
      success: true,
      data: allMembers,
    });
  } catch (err) {
    console.error(err);
    NextResponse.json({
      success: false,
      message: messages.getAllMember.ERROR,
    }, { status: 500 });
  }
}

export async function POST(req) {
  const {
    name,
    birth,
    gender,
    phone,
    imageUrl,
    address,
    membershipPlanId,
    status,
    expiredDate,
  } = await req.json();

  const { error } = schema.validate({
    name,
    birth,
    gender,
    phone,
    imageUrl,
    address,
    membershipPlanId,
    status,
    expiredDate,
  });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    }, { status: 400 });
  }

  try {
    await connectToDB();
    const memberExist = await Member.findOne({ phone });
    if (memberExist) {
      return NextResponse.json({
        success: false,
        message: messages.addMember.MEMBER_EXIST,
      }, { status: 409 });
    }

    const newMember = await Member.create({
      name,
      birth,
      gender,
      phone,
      imageUrl,
      address,
      membershipPlanId,
      status,
      expiredDate,
    });
    if (newMember) {
      return NextResponse.json({
        success: true,
        message: messages.addMember.SUCCESS,
      }, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.addMember.ERROR,
    }, { status: 500 });
  }
}
