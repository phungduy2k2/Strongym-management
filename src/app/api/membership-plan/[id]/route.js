import connectToDB from "@/database";
import MembershipPlan from "@/models/membershipPlan";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().required(),
})

// get membershipPlan by ID
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const plan = await MembershipPlan.findById(params.id);
    if (!plan) {
      return NextResponse.json({ 
        success: false, 
        message: messages.getPlanById.NOT_FOUND 
      }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      message: messages.getPlanById.ERROR 
    }, { status: 500 });
  }
}

// update membershipPlan
export async function PUT(req, { params }) {
  try {
    const { name, price, description } = await req.json();
    const { error } = schema.validate({ name, price, description });
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      }, { status: 400 });
    }
    
    await connectToDB();
    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      params.id,
      { name, price, description },
      { new: true, runValidators: true }
    );
    if (!updatedPlan) {
      return NextResponse.json({ 
        success: false, 
        message: messages.updatePlan.NOT_FOUND 
      }, { status: 404 });
    }
    return NextResponse.json({ 
      success: true, 
      message: messages.updatePlan.SUCCESS,
      data: updatedPlan 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      message: messages.updatePlan.ERROR 
    }, { status: 500 });
  }
}

// delete membershipPlan
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const deletedPlan = await MembershipPlan.findByIdAndDelete(params.id);
    if (!deletedPlan) {
      return NextResponse.json({ 
        success: false, 
        message: messages.deletePlan.NOT_FOUND 
      }, { status: 404 });
    }
    return NextResponse.json({ 
      success: true, 
      message: messages.deletePlan.SUCCESS 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      message: messages.deletePlan.ERROR 
    }, { status: 500 });
  }
}
