import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  imageUrl: Joi.string().optional(),
  trainerId: Joi.string().required(),
  maxStudent: Joi.number().integer().min(1),
  memberIds: Joi.array().optional(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
  approvalStatus: Joi.string().allow("PENDING", "ACCEPTED", "REJECTED").required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  schedule: Joi.array().optional(),
});

export const dynamic = "force-dynamic";

// add new class
export async function POST(req) {
  const authError = await authorize(["manager", "trainer"]);
  if (authError) return authError;

  const { name, imageUrl, trainerId, maxStudent, memberIds, price, currency, description, status, approvalStatus, startDate, endDate, schedule } = await req.json();
  const { error } = schema.validate({ name, imageUrl, trainerId, maxStudent, memberIds, price, currency, description, status, approvalStatus, startDate, endDate, schedule });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    await connectToDB();
    const classExist = await Class.findOne({ name });
    if (classExist) {
      return NextResponse.json({
        success: false,
        message: messages.addClass.CLASS_EXIST,
      }, { status: 409 });
    }

    const newClass = await Class.create({ name, imageUrl, trainerId, maxStudent, memberIds, price, currency, description, status, approvalStatus, startDate, endDate, schedule });
    if (newClass) {
      return NextResponse.json({
        success: true,
        message: messages.addClass.SUCCESS,
        data: newClass
      }, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.addClass.ERROR,
    }, { status: 500 });
  }
}

//get all classes
export async function GET() {
  const authError = await authorize(["manager", "trainer", "member"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const allClasses = await Class.find({})
      .populate("trainerId", "name")
      .populate("memberIds", "name phone")
    return NextResponse.json({
      success: true,
      data: allClasses
    })
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllClass.ERROR
    }, { status: 500 });
  }
}
