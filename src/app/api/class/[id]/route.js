import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Class from "@/models/class";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// get class by ID
export async function GET(req, { params }) {
  const authError = await authorize(["manager", "trainer", "member"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const thisClass = await Class.findById(params.id).populate("trainerId", "name").populate("memberIds", "name phone");
    if (!thisClass) {
      return NextResponse.json({
        success: true,
        message: messages.getClassById.NOT_FOUND,
      },{ status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: thisClass,
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getClassById.ERROR,
    }, { status: 500 });
  }
}

//  update class
export async function PUT(req, { params }) {
  const authError = await authorize(["manager", "trainer"]);
  if (authError) return authError;

  try {
    await connectToDB();

    const classData = await req.json();
    const updatedClass = await Class.findByIdAndUpdate(params.id, classData, {
      new: true,
      runValidators: true
    }).populate("trainerId", "name").populate("memberIds", "name phone");
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
  const authError = await authorize(["manager", "trainer"]);
  if (authError) return authError;
  
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

// adding member into a class
export async function PATCH(req, { params }) {
  const authError = await authorize(req, ["manager", "member"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const { memberId } = await req.json();

    const currentClass = await Class.findOne({ _id: params.id });
    if(currentClass && currentClass.memberIds?.includes(memberId)) {
      return NextResponse.json({
        success: false,
        message: messages.updateClass.REGISTERED,
      }, { status: 400 })
    }

    const updatedClass = await Class.findOneAndUpdate(
      { _id: params.id },
      { $push: { memberIds: memberId } }
    );

    if (!updatedClass) {
      return NextResponse.json({
        success: false,
        message: messages.updateClass.REGISTER_ERROR,
      })
    }

    return NextResponse.json({
      success: true,
      message: messages.updateClass.REGISTER_SUCCESS,
    })
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateClass.ERROR,
    }, { status: 500 });
  }
}
