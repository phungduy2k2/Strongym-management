import connectToDB from "@/database";
import User from "@/models/user";
import { messages } from "@/utils/message";
import { compare } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const schema = Joi.object({
  username: Joi.string().min(8).required(),
  password: Joi.string()
  .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
  .required()
  .messages({
    "string.pattern.base": "Password cần tối thiểu 8 ký tự chứa cả chữ cái và số.",
  }),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { username, password } = await req.json();

  const { error } = schema.validate({ username, password });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const checkUser = await User.findOne({ username });
    if (!checkUser) {
      return NextResponse.json({
        success: false,
        message: messages.login.USER_NOT_FOUND,
      });
    }

    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: messages.login.INCORRECT_PASSWORD,
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        username: checkUser?.username,
        role: checkUser?.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const finalData = {
      token,
      user: {
        username: checkUser.username,
        name: checkUser.name,
        _id: checkUser._id,
        role: checkUser.role,
      },
    };

    return NextResponse.json({
      success: true,
      message: messages.login.SUCCESS,
      finalData,
    });
  } catch (e) {
    console.log("Error while logging in. Please try again");

    return NextResponse.json({
      success: false,
      message: messages.login.ERROR,
    });
  }
}
