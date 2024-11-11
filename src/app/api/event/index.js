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

// add new event
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

// search active event
export async function GET(req) {
  await connectToDB();

  try {
    const currentDate = new Date();
    const upcomingDate = new Date(currentDate);
    upcomingDate.setDate(currentDate.getDate() + 10); // 10 ngày tới

    const events = await Event.find({
      $and: [
        { startDate: { $lte: upcomingDate } },
        { endDate: { $gte: currentDate } },
      ],
    });

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.activeEvent.ERROR,
    });
  }
}

// update event
export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, title, description, banner, creatorId, startDate, endDate } =
      await req.json();

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: _id },
      { title, description, banner, creatorId, startDate, endDate },
      { new: true }
    );

    if (updatedEvent) {
      return NextResponse.json({
        success: true,
        message: messages.updateEvent.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.updateEvent.ERROR,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.updateEvent.ERROR,
    });
  }
}
