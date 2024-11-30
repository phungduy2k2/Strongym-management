import connectToDB from "@/database";
import Equipment from "@/models/equipment";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  creatorId: Joi.string().required(),
  nextMaintenanceDate: Joi.date().optional(),
});

export const dynamic = "force-dynamic";

// add new equipment
export async function POST(req) {
  await connectToDB();

  const { name, quantity, creatorId, nextMaintenanceDate } = req.json();

  const { error } = schema.validate({ name, quantity, creatorId, nextMaintenanceDate });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const newEquipment = await Equipment.create({ name, quantity, creatorId, nextMaintenanceDate });
    if (newEquipment) {
      return NextResponse.json({
        success: true,
        message: messages.addEquipment.SUCCESS,
      }, { status: 201 });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.addEquipment.ERROR,
    }, { status: 500 });
  }
}

// get all equipment
export async function GET(req) {
  try {
    await connectToDB();
    const allEquipments = await Equipment.find({});

    if (!allEquipments) {
      return NextResponse.json({
        success: false,
        message: messages.getAllEquipment.NOT_FOUND,
      });
    } 
    return NextResponse.json({
      success: true,
      data: allEquipments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllEquipment.ERROR,
    });
  }
}
