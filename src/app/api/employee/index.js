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

// add new employee
export async function POST(req) {
  await connectToDB();

  const { name, birth, phone, imageUrl, idCard, address, position } =
    await req.json();

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
    }
    const newEmployee = await Employee.create({
      name,
      birth,
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
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.addEmployee.ERROR,
    });
  }
}

// get all employee
export async function GET(req) {
  try {
    await connectToDB();

    const allEmployees = await Employee.find({});

    if (allEmployees) {
      return NextResponse.json({
        success: true,
        data: allEmployees,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: messages.getAllEmployee.NO_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllEmployee.ERROR,
    });
  }
}

// search employee theo name hoặc phone
export async function GET(req) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json({
      success: false,
      message: messages.searchEmployee.NO_SEARCH,
    });
  }

  try {
    const employees = await Employee.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    });

    if (employees) {
      return NextResponse.json({
        success: true,
        message: messages.searchEmployee.SUCCESS,
        data: employees,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: messages.searchEmployee.NO_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.searchEmployee.ERROR,
    });
  }
}

// update employee
export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, name, birth, phone, imageUrl, idCard, address, position } =
      await req.json();

    const updateEmployee = await Employee.findOneAndUpdate(
      { _id: _id },
      { name, birth, phone, imageUrl, idCard, address, position },
      { new: true }
    );

    if (updateEmployee) {
      return NextResponse.json({
        success: true,
        message: messages.updateEmployee.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.updateEmployee.ERROR,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.updateEmployee.ERROR,
    });
  }
}

// delete employee
export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: messages.deleteEmployee.NO_ID,
      });
    }

    const deletedEmployee = await Member.findByIdAndDelete(id);

    if (deletedEmployee) {
      return NextResponse.json({
        success: true,
        message: messages.deleteEmployee.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.deleteEmployee.ERROR,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteEmployee.ERROR,
    });
  }
}
