import connectToDB from "@/database";
import Event from "@/models/event";
import { NextResponse } from "next/server";

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
      message: "Failed to fetch events. Please try again later.",
    });
  }
}
