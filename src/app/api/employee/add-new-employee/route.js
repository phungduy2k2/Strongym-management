import connectToDB from "@/database";
import Employee from "@/models/employee";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  phone: Joi.string().pattern(/^[0]\d{9}$/).required(),
  imageUrl: Joi.string().required(),
  idCard: Joi.string().pattern(/^[0-9]{12}$/).required(),
  address: Joi.string().required(),
  position: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { name, birth, phone, imageUrl, idCard, address, position } = await req.json();

  const { error } = schema.validate({
    name,
    birth,
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
    });
  }

  try {
    const employeeExist = await Employee.findOne({ idCard });
    if (employeeExist) {
      return NextResponse.json({
        success: false,
        message: messages.addEmployee.EMPLOYEE_EXIST,
      });
    } else {
      const newEmployee = await Employee.create({
        name,
        birth,
        phone,
        imageUrl,
        idCard,
        address,
        position,
      });

      if(newEmployee) {
        return NextResponse.json({
            success: true,
            message: messages.addEmployee.SUCCESS,
          });
      }
    }
  } catch (err) {
    return NextResponse.json({
        success: false,
        message: messages.addEmployee.ERROR,
      });
  }
}
