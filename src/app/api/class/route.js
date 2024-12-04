import connectToDB from "@/database";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  imageUrl: Joi.string().optional(),
  trainerId: Joi.string().required(),
  price: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

export const dynamic = "force-dynamic";

// add new class
export async function POST(req) {
  const { name, imageUrl, trainerId, price, description, startDate, endDate } = await req.json();
  const { error } = schema.validate({ name, imageUrl, trainerId, price, description, startDate, endDate });
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

    const newClass = await Class.create({ name, imageUrl, trainerId, price, description, startDate, endDate });
    if (newClass) {
      return NextResponse.json({
        success: true,
        message: messages.addClass.SUCCESS,
        data: newClass
      }, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.addClass.ERROR,
    }, { status: 500 });
  }
}

//get all classes
export async function GET() {
  try {
    await connectToDB();
    const allClasses = await Class.find({}).populate("trainerId", "name") //// populate  "creatorId"
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
