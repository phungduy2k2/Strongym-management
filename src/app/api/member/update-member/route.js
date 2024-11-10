import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
