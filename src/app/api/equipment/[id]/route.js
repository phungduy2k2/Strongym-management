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

// get equipment by ID
export async function GET(req, { params }) {
    try {
      await connectToDB();
      const equipment = await Member.findById(params.id);
      if (!equipment) {
        return NextResponse.json({
          success: false,
          message: messages.getEquipmentById.NOT_FOUND,
        },{ status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: equipment,
      }, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({
        success: false,
        message: messages.getEquipmentById.ERROR,
      }, { status: 500 });
    }
  }

// update equipment
export async function PUT(req, { params }) {
  try {
    const equipmentData = await req.json();
    const { error } = schema.validate(equipmentData);
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      }, { status: 400 });
    }

    await connectToDB();
    const updatedEquipment = await Equipment.findByIdAndUpdate(params.id, equipmentData,{
        new: true,
        runValidators: true
    });

    if (!updatedEquipment) {
      return NextResponse.json({
        success: false,
        message: messages.updateEquipment.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.updateEquipment.SUCCESS,
      data: updatedEquipment
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateEquipment.ERROR,
    }, { status: 500 });
  }
}

// delete quipment
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const deletedEquipment = await Equipment.findByIdAndDelete(params.id);

    if (!deletedEquipment) {
      return NextResponse.json({
        success: true,
        message: messages.deleteEquipment.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.deleteEquipment.SUCCESS,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteEquipment.ERROR,
    }, { status: 500 });
  }
}
