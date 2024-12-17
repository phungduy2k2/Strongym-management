import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import MemberClass from "@/models/memberClass";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// find MemberClass by memberId
export async function GET(req, { params }) {
  const authError = await authorize(["manager", "member"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const memberId = params.id;
    const memberClass = await MemberClass.find({ memberId: memberId });
    if (!memberClass) {
      return NextResponse.json({
        success: false,
        message: messages.getMemberClassByMemberId.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: memberClass });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getMemberClassByMemberId.ERROR,
    }, { status: 404 });
  }
}
