import connectToDB from "@/database";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  trainerId: Joi.string().required(),
  price: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

//  update class
export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const classData = await req.json();
    const { error } = schema.validate(classData);
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      }, { status: 400 });
    }

    const updatedClass = await Class.findByIdAndUpdate(params.id, classData,{
      new: true,
      runValidators: true,
    });
    if (!updatedClass) {
      return NextResponse.json({
        success: false,
        message: messages.updateClass.NOT_FOUND,
      }, { status: 404});
    }
    return NextResponse.json({
      success: true,
      message: messages.updateClass.SUCCESS,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateClass.ERROR,
    }, { status: 500 });
  }
}

// delete class
export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const deletedClass = await Class.findByIdAndDelete(params.id);

    if (!deletedClass) {
      return NextResponse.json({
        success: false,
        message: messages.deleteClass.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.deleteClass.ERROR,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteClass.ERROR,
    }, { status: 500 });
  }
}
