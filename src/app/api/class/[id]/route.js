import connectToDB from "@/database";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

//  update class
export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const classData = await req.json();
    const updatedClass = await Class.findByIdAndUpdate(params.id, classData, {
      new: true,
      runValidators: true
    }).populate("trainerId", "name");
    if (!updatedClass) {
      return NextResponse.json({
        success: false,
        message: messages.updateClass.NOT_FOUND,
      }, { status: 404});
    }
    return NextResponse.json({
      success: true,
      message: messages.updateClass.SUCCESS,
      data: updatedClass
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
      message: messages.deleteClass.SUCCESS ,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteClass.ERROR,
    }, { status: 500 });
  }
}
