import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  phone: Joi.string().pattern(/^[0]\d{9}$/).required(),
  address: Joi.string().required(),
  membershipPlanId: Joi.string().optional(),
  status: Joi.string().required(),
  expiredDate: Joi.date().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { name, birth, phone, address, membershipPlanId, status, expiredDate } = await req.json();

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
