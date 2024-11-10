import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    //// user is MANAGER ?
    const isAuthManager = true;

    if (isAuthManager) {
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
    } else {
      return NextResponse.json({
        success: false,
        message: messages.deleteMember.NOT_AUTHORIZED,
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
