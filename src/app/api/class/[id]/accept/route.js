import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// update class approvalStatus PENDING -> ACCEPTED
export async function PATCH(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    connectToDB();
    const acceptedClass = await Class.findOneAndUpdate(
      { _id: params.id, approvalStatus: "PENDING" },
      { approvalStatus: "ACCEPTED" },
      { new: true }
    );

    if (!acceptedClass) {
      return NextResponse.json({
        success: false,
        message: messages.acceptClass.NOT_FOUND,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: messages.acceptClass.SUCCESS,
      data: acceptedClass,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.acceptClass.ERROR,
    }, { status: 500 });
  }
}
