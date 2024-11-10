import connectToDB from "@/database";
import Equipment from "@/models/equipment";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: messages.deleteEquipment.NO_ID,
      });
    }

    //// user is MANAGER ?
    const isAuthManager = true;

    if (isAuthManager) {
      const deletedEquipment = await Equipment.findByIdAndDelete(id);

      if (deletedEquipment) {
        return NextResponse.json({
          success: true,
          message: messages.deleteEquipment.SUCCESS,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: messages.deleteEquipment.ERROR,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: messages.deleteEquipment.NOT_AUTHORIZED,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteEquipment.ERROR,
    });
  }
}
