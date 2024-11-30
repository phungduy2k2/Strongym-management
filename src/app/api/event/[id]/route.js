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

// get event by id
export async function GET(req, { params }) {
    try {
      await connectToDB();
      const event = await Event.findById(params.id);
      if (!event) {
        return NextResponse.json({
          success: false,
          message: messages.getEventById.NOT_FOUND,
        }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: event });
    } catch (err) {
      console.error(err);
      return NextResponse.json({
        success: false,
        message: messages.getEventById.ERROR,
      }, { status: 500 });
    }
}

// update event
export async function PUT(req, { params }) {
  try {
    const eventData = await req.json();
    const { error } = schema.validate(eventData);
    if(error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      }, { status: 400 });
    }

    await connectToDB();
    const updatedEvent = await Event.findByIdAndUpdate(params.id, eventData,{ 
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json({
        success: false,
        message: messages.updateEvent.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.updateEvent.SUCCESS,
      data: updatedEvent
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateEvent.ERROR,
    }, { status: 500 });
  }
}

// delete event ?
