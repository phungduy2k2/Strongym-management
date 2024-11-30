import connectToDB from "@/database";
import Employee from "@/models/employee";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  gender: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0]\d{9}$/)
    .required(),
  imageUrl: Joi.string().required(),
  idCard: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required(),
  address: Joi.string().required(),
  position: Joi.string().required(),
});

// get employee by id
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const employee = await Employee.findById(params.id);
    if (!employee) {
      return NextResponse.json({
        success: false,
        message: messages.getEmployeeById.NOT_FOUND,
      },{ status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: employee,
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getEmployeeById.ERROR,
    }, { status: 500 });
  }
}

// update employee
export async function PUT(req, { params }) {
  try {
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

    await connectToDB();

    const updateEmployee = await Employee.findByIdAndUpdate(
      params.id,
      { name, birth, gender, phone, imageUrl, idCard, address, position },
      { new: true, runValidators: true }
    );

    if (!updateEmployee) {
      return NextResponse.json({
        success: true,
        message: messages.updateEmployee.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.updateEmployee.SUCCESS,
      data: updateEmployee,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateEmployee.ERROR,
    }, { status: 500 });
  }
}

// delete employee
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const deletedEmployee = await Employee.findByIdAndDelete(params.id);
    if (!deletedEmployee) {
      return NextResponse.json({
        success: true,
        message: messages.deleteEmployee.NOT_FOUND,
      }, { status: 404 });
    }
      
    return NextResponse.json({
      success: true,
      message: messages.deleteEmployee.SUCCESS,
    });    
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteEmployee.ERROR,
    }, { status: 500 });
  }
}
