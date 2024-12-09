import connectToDB from "@/database";
import Payment from "@/models/payment";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";



const schema = Joi.object({
    customer: Joi.string().required(),
    memberId: Joi.string().allow(null).optional(),
    membershipPlanId: Joi.string().allow(null).optional(),
    classId: Joi.string().allow(null).optional(),
    amount: Joi.number().required(),
    currency: Joi.string().required(), // enum: ["VND", "USD", "EUR"]
    description: Joi.string().required(),
    paymentMethod: Joi.string().required(), // enum: ["cash", "card", "stripe"]
})

export async function POST(req) {
    await connectToDB();
    const { customer, memberId, membershipPlanId, classId, amount, currency, description, paymentMethod } = await req.json()
    const { error } = schema.validate({ customer, memberId, membershipPlanId, classId, amount, currency, description, paymentMethod });
    if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
    }

    try {
        const newPayment = await Payment.create({ customer, memberId, membershipPlanId, classId, amount, currency, description, paymentMethod })
        if (newPayment) {
            return NextResponse.json({
                success: true,
                message: messages.createPayment.SUCCESS,
                data: newPayment
            }, { status: 201 })
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: messages.createPayment.ERROR,
        }, { status: 500 });
    }
}