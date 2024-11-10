import connectToDB from "@/database";
import Event from "@/models/event";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, title, description, banner, creatorId, startDate, endDate } = await req.json();

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
