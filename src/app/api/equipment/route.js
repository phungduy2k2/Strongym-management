import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Equipment from "@/models/equipment";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  creatorId: Joi.string().required(),
  nextMaintenanceDate: Joi.date().allow("").optional(),
});

export const dynamic = "force-dynamic";

// add new equipment
export async function POST(req) {
  const authError = await authorize(["manager"]);
  if (authError) return authError;

  await connectToDB();

  const { name, quantity, creatorId, nextMaintenanceDate } = await req.json();
  const { error } = schema.validate({ name, quantity, creatorId, nextMaintenanceDate });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    }, { status: 400 });
  }

  try {
    const newEquipment = await Equipment.create({ name, quantity, creatorId, nextMaintenanceDate });
    if (newEquipment) {
      return NextResponse.json({
        success: true,
        message: messages.addEquipment.SUCCESS,
        data: newEquipment
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
  const authError = await authorize(["manager"]);
  if (authError) return authError;
  
  try {
    await connectToDB();
    const allEquipments = await Equipment.find({});

    if (!allEquipments) {
      return NextResponse.json({
        success: false,
        message: messages.getAllEquipment.NOT_FOUND,
      }, { status: 404 });
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
    }, { status: 500 });
  }
}
