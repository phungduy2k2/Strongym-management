import connectToDB from "@/database";
import User from "@/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const schema = Joi.object({
  username: Joi.string().min(8).required(),
  password: Joi.string().required(),
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
        message: "Account not found with this username",
      });
    }

    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password. Please try again !",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        username: checkUser?.username,
        role: checkUser?.role,
      },
      "default_secret_key",
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
      message: "Login successfully!",
      finalData,
    });
  } catch (e) {
    console.log("Error while logging in. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
