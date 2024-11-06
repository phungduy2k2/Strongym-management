import connectToDB from "@/database";
import User from "@/models/user";
import { messages } from "@/utils/message";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  username: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { username, password, role } = await req.json();

  const { error } = schema.validate({ username, password, role });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await User.findOne({ username });

    if (userExist) {
      return NextResponse.json({
        success: false,
        message: messages.register.EMAIL_EXIST,
      });
    } else {
      const hashPassword = await hash(password, 12);

      const newCreatedUser = await User.create({
        username,
        password: hashPassword,
        role,
      });

      if (newCreatedUser) {
        return NextResponse.json({
          success: true,
          message: messages.register.SUCCESS,
        });
      }
    }
  } catch (err) {
    console.log("Error while new user registration. Please try again");

    return NextResponse.json({
      success: false,
      message: messages.register.ERROR,
    });
  }
}
