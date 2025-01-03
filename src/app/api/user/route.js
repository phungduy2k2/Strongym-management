import connectToDB from "@/database";
import User from "@/models/user";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required(),
  memberId: Joi.string().allow(null).optional(),
  employeeId: Joi.string().allow(null).optional()
});

// create new User (follow Clerk account)
export async function POST(req) {
  await connectToDB();

  const { userId, username, email, role, memberId, employeeId } = await req.json();
  const { error } = schema.validate({ userId, username, email, role, memberId, employeeId });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json({
        success: false,
        message: messages.register.USERNAME_EXIST,
      }, { status: 409 });
    }

    const newUser = await User.create({ userId, username, email, role, memberId, employeeId });
    if (newUser) {
      return NextResponse.json({
        success: true,
        message: messages.register.SUCCESS,
        data: newUser
      }, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.register.ERROR,
    }, { status: 500 });
  }
}
