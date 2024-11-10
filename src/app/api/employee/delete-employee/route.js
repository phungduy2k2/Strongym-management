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
        message: messages.deleteEmployee.NO_ID,
      });
    }

    //// user is MANAGER ?
    const isAuthManager = true;

    if (isAuthManager) {
      const deletedEmployee = await Member.findByIdAndDelete(id);

      if (deletedEmployee) {
        return NextResponse.json({
          success: true,
          message: messages.deleteEmployee.SUCCESS,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: messages.deleteEmployee.ERROR,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: messages.deleteEmployee.NOT_AUTHORIZED,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteEmployee.ERROR,
    });
  }
}
