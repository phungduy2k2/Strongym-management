import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();
    //// user is MANAGER ???
    const role = "manager";

    if (role === "manager") {
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
          message: "No Member found",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: messages.getAllMember.NOT_AUTHORIZED,
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
