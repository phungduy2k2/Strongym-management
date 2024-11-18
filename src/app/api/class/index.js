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

export const dynamic = "force-dynamic";

// add new class
export async function POST(req) {
  await connectToDB();
  const { name, trainerId, price, description, startDate, endDate } =
    await req.json();

  const { error } = schema.validate({
    name,
    trainerId,
    price,
    description,
    startDate,
    endDate,
  });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const classExist = await Class.findOne({ name });
    if (classExist) {
      return NextResponse.json({
        success: false,
        message: messages.addClass.CLASS_EXIST,
      });
    }

    const newClass = await Class.create({
      name,
      trainerId,
      price,
      description,
      startDate,
      endDate,
    });
    if (newClass) {
      return NextResponse.json({
        success: true,
        message: messages.addClass.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.addClass.ERROR,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.addClass.ERROR,
    });
  }
}

//  update class
export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, name, trainerId, price, description, startDate, endDate } =
      await req.json();

    const updatedClass = await Class.findOneAndUpdate(
      { _id: _id },
      { name, trainerId, price, description, startDate, endDate },
      { new: true }
    );
    if (updatedClass) {
      return NextResponse.json({
        success: true,
        message: messages.updateClass.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.updateClass.ERROR,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.updateClass.ERROR,
    });
  }
}

// delete class
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

    const deletedClass = await Class.findByIdAndDelete(id);

    if (deletedClass) {
      return NextResponse.json({
        success: true,
        message: messages.deleteClass.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.deleteEmployee.ERROR,
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
