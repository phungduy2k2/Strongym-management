import connectToDB from "@/database";
import Equipment from "@/models/equipment";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    //// user is MANAGER ???
    const role = "manager";

    if (role === "manager") {
      const allEquipments = await Equipment.find({});

      if (allEquipments) {
        return NextResponse.json({
          success: true,
          data: allEquipments,
        });
      } else {
        return NextResponse.json({
          success: false,
          status: 204,
          message: "No Equipment found",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: messages.getAllEquipment.NOT_AUTHORIZED,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllEquipment.ERROR,
    });
  }
}
