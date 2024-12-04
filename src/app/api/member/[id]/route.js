import connectToDB from "@/database";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// get member by ID
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const member = await Member.findById(params.id).populate("membershipPlanId", "name");
    if (!member) {
      return NextResponse.json({
        success: false,
        message: messages.getAMember.NOT_FOUND,
      },{ status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: member,
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getAMember.ERROR,
    }, { status: 500 });
  }
}

//  update member
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const body = await req.json();    
    const updateMember = await Member.findByIdAndUpdate(params.id, body, {
      new: true,
    }).populate("membershipPlanId", "name");
    if (!updateMember) {
      return NextResponse.json({
        success: false,
        message: messages.updateMember.NOT_FOUND,
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: messages.updateMember.SUCCESS,
      data: updateMember
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateMember.ERROR,
    }, { status: 500 });
  }
}

// delete member
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const deleteMember = await Member.findByIdAndDelete(params.id);
    if (!deleteMember) {
      return NextResponse.json({
        success: false,
        message: messages.deleteMember.NOT_FOUND,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: messages.deleteMember.SUCCESS,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteMember.ERROR,
    }, { status: 500 });
  }
}
