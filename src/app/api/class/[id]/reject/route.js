import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// update class approvalStatus PENDING -> REJECTED
export async function PATCH(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    connectToDB();
    const rejectedClass = await Class.findOneAndUpdate(
      { _id: params.id, approvalStatus: "PENDING" },
      { approvalStatus: "REJECTED" },
      { new: true }
    );

    if (!rejectedClass) {
      return NextResponse.json({
        success: false,
        message: messages.rejectClass.NOT_FOUND,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: messages.rejectClass.SUCCESS,
      data: rejectedClass,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.rejectClass.ERROR,
    }, { status: 500 });
  }
}
