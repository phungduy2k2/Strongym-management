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

// get all equipment
export async function GET(req) {
  try {
    await connectToDB();

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
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllEquipment.ERROR,
    });
  }
}

// update equipment
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

// delete quipment
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
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteEquipment.ERROR,
    });
  }
}
