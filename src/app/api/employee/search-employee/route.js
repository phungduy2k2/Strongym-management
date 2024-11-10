import connectToDB from "@/database";
import Employee from "@/models/employee";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
