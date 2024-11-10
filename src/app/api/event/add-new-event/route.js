import connectToDB from "@/database";
import Event from "@/models/event";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  banner: Joi.string().uri().required(),
  creatorId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { title, description, banner, creatorId, startDate, endDate } =
    await req.json();

  const { error } = schema.validate({
    title,
    description,
    banner,
    creatorId,
    startDate,
    endDate,
  });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const newEvent = await Event.create({
      title,
      description,
      banner,
      creatorId,
      startDate,
      endDate,
    });

    if (newEvent) {
      return NextResponse.json({
        success: true,
        message: messages.addEvent.SUCCESS,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.addEvent.ERROR,
    });
  }
}
