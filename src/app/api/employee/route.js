import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Employee from "@/models/employee";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  gender: Joi.boolean().required(),
  phone: Joi.string().pattern(/^[0]\d{9}$/).required(),
  imageUrl: Joi.string().required(),
  idCard: Joi.string().pattern(/^[0-9]{12}$/).required(),
  address: Joi.string().required(),
  position: Joi.string().required(),
});

export const dynamic = "force-dynamic";

// create employee
export async function POST(req) {
  const authError = await authorize(["manager"]);
  if (authError) return authError;

  await connectToDB();

  const { name, birth, gender, phone, imageUrl, idCard, address, position } = await req.json();

  const { error } = schema.validate({
    name,
    birth,
    gender,
    phone,
    imageUrl,
    idCard,
    address,
    position,
  });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    }, { status: 400 });
  }

  try {
    await connectToDB();
    const employeeExist = await Employee.findOne({ $or: [{ idCard }, { phone }] });
    if (employeeExist) {
      return NextResponse.json({
        success: false,
        message: messages.addEmployee.EMPLOYEE_EXIST,
      }, { status: 409 });
    }

    const newEmployee = await Employee.create({
      name,
      birth,
      gender,
      phone,
      imageUrl,
      idCard,
      address,
      position,
    });
    if (newEmployee) {
      return NextResponse.json({
        success: true,
        message: messages.addEmployee.SUCCESS,
        data: newEmployee
      }, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.addEmployee.ERROR,
    }, { status: 500 });
  }
}

// get all employee
export async function GET(req) {
  const authError = await authorize(["manager"]);
  if (authError) return authError;
  
  try {
    await connectToDB();
    const allEmployees = await Employee.find({});
    return NextResponse.json({
      success: true,
      data: allEmployees,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllEmployee.ERROR,
    }, { status: 500 });
  }
}
