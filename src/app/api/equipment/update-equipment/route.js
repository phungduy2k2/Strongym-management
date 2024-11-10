import connectToDB from "@/database";
import Equipment from "@/models/equipment";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, name, quantity, creatorId, nextMaintenanceDate } =
      await req.json();

    const updatedEquipment = await Equipment.findOneAndUpdate(
      { _id: _id },
      { name, quantity, creatorId, nextMaintenanceDate },
      { new: true }
    );

    if (updatedEquipment) {
      return NextResponse.json({
        success: true,
        message: messages.updateEquipment.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.updateEquipment.ERROR,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.updateEquipment.ERROR,
    });
  }
}
