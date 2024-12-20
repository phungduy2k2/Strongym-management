import connectToDB from '@/database';
import { authorize } from '@/lib/middleware';
import MembershipPlan from '@/models/membershipPlan';
import { messages } from '@/utils/message';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    duration: Joi.number().min(0).required(),
    description: Joi.string().required(),
    total_member: Joi.number().min(0).required()
})

export const dynamic = "force-dynamic";

export async function GET() {
    const authError = await authorize(["manager", "member"]);
    if (authError) return authError;
    
    try {
        await connectToDB();
        const allPlans = await MembershipPlan.find({});
        return NextResponse.json({
            success: true,
            data: allPlans,
        })
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: messages.getAllPlans.ERROR,
        }, { status: 500 })
    }
}

export async function POST(req) {
    const authError = await authorize(["manager"]);
    if (authError) return authError;

    const { name, price, duration, description, total_member } = await req.json();
    const { error } = schema.validate({ name, price, duration, description, total_member });
    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
        }, { status: 400 })
    }

    try {
        await connectToDB();
        const planExist = await MembershipPlan.findOne({ name });
        if (planExist) {
            return NextResponse.json({
                success: false,
                message: messages.addPlan.PLAN_EXIST,
            }, { status: 409 })
        }

        const newPlan = await MembershipPlan.create({ name, price, duration, description, total_member });
        if (newPlan) {
            return NextResponse.json({
                success: true,
                message: messages.addPlan.SUCCESS,
                data: newPlan
            }, { status: 201 })
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: messages.addPlan.ERROR,
        }, { status: 500 })
    }
}
