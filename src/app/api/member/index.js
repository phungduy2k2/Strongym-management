import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  phone: Joi.string()
    .pattern(/^[0]\d{9}$/)
    .required(),
  address: Joi.string().required(),
  membershipPlanId: Joi.string().optional(),
  status: Joi.string().required(),
  expiredDate: Joi.date().required(),
});

export const dynamic = "force-dynamic";

// add new member
export async function POST(req) {
  await connectToDB();

  const { name, birth, phone, address, membershipPlanId, status, expiredDate } =
    await req.json();

  const { error } = schema.validate({
    name,
    birth,
    phone,
    address,
    membershipPlanId,
    status,
    expiredDate,
  });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const memberExist = await Member.findOne({ phone });
    if (memberExist) {
      return NextResponse.json({
        success: false,
        message: messages.addMember.MEMBER_EXIST,
      });
    } else {
      const newMember = await Member.create({
        name,
        birth,
        phone,
        address,
        membershipPlanId,
        status,
        expiredDate,
      });

      if (newMember) {
        return NextResponse.json({
          success: true,
          message: messages.addMember.SUCCESS,
        });
      }
    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: messages.addMember.ERROR,
    });
  }
}

// get all member
export async function GET(req) {
  try {
    await connectToDB();

    const allMembers = await Member.find({});

    if (allMembers) {
      return NextResponse.json({
        success: true,
        data: allMembers,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: messages.getAllMember.NO_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllMember.ERROR,
    });
  }
}

// update member
export async function PUT(req) {
  try {
    await connectToDB();

    const {
      _id,
      name,
      birth,
      phone,
      address,
      membershipPlanId,
      status,
      expiredDate,
    } = await req.json();

    const updateMember = await Member.findOneAndUpdate(
      { _id: _id },
      { name, birth, phone, address, membershipPlanId, status, expiredDate },
      { new: true }
    );

    if (updateMember) {
      return NextResponse.json({
        success: true,
        message: messages.updateMember.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.updateMember.ERROR,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.updateMember.ERROR,
    });
  }
}

//delete member
export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: messages.deleteMember.NO_ID,
      });
    }

    const deletedMember = await Member.findByIdAndDelete(id);

    if (deletedMember) {
      return NextResponse.json({
        success: true,
        message: messages.deleteMember.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.deleteMember.ERROR,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteMember.ERROR,
    });
  }
}
