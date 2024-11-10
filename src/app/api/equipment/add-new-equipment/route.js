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

export async function POST(req) {
  await connectToDB();

  const { name, quantity, creatorId, nextMaintenanceDate } = req.json();

  const { error } = schema.validate({
    name,
    quantity,
    creatorId,
    nextMaintenanceDate,
  });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const newEquipment = await Equipment.create({
      name,
      quantity,
      creatorId,
      nextMaintenanceDate,
    });

    if (newEquipment) {
      return NextResponse.json({
        success: true,
        message: messages.addEquipment.SUCCESS,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.addEquipment.ERROR,
    });
  }
}
