import connectToDB from "@/database";
import User from "@/models/user";
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
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const isuserExist = await User.findOne({ username });

    if (isuserExist) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
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
          message: "Account created successfully!",
        });
      }
    }
  } catch (err) {
    console.log("Error while new user registration. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
}
