import connectToDB from "@/database";
import MemberClass from "@/models/memberClass";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

const Joi = require("joi");

const schema = Joi.object({
  memberId: Joi.string().required(),
  classId: Joi.string().required(),
});

//add new relationship member-class
export async function POST(req) {
  const { memberId, classId, registrationDate } = await req.json();
  const { error } = schema.validate({ memberId, classId });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    await connectToDB();

    const newMemberClass = await MemberClass.create({ memberId, classId });
    if (newMemberClass) {
        return NextResponse.json({
            success: true,
            message: messages.createMemberClass.SUCCESS,
            data: newMemberClass
        }, { status: 201 })
    }
  } catch(err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.createMemberClass.ERROR,
    }, { status: 500 });
  }
}

// get all relationship
export async function GET() {
    try {
      await connectToDB();
      const allRelationship = await MemberClass.find({}).populate("memberId", "name").populate("classId", "name");
      return NextResponse.json({
        success: true,
        data: allRelationship
      })
    } catch (err) {
      console.error(err);
      return NextResponse.json({
        success: false,
        message: messages.getAllMemberClass.ERROR
      }, { status: 500 });
    }
  }
