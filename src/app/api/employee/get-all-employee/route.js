import connectToDB from "@/database";
import Employee from "@/models/employee";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();
    //// user is MANAGER ???
    const role = "manager";

    if (role === "manager") {
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
          message: "No Employee found",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: messages.getAllEmployee.NOT_AUTHORIZED,
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
