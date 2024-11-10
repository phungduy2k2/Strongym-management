import connectToDB from "@/database";
import Employee from "@/models/employee";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, name, birth, phone, imageUrl, idCard, address, position } = await req.json();

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
