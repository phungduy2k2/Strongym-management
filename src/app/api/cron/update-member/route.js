import connectToDB from "@/database";
import Member from "@/models/member";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const today = new Date();
    const expiredMembers = await Member.find({
      expiredDate: { $lt: today },
      status: { $ne: "expired" },
    });

    if (expiredMembers.length > 0) {
      const updates = expiredMembers.map((member) => ({
        updateOne: {
          filter: { _id: member._id },
          update: { $set: { status: "expired", membershipPlanId: null } },
        },
      }));

      await Member.bulkWrite(updates);
    }

    return NextResponse.json({
      success: true,
      message: `${expiredMembers.length} thành viên đã được cập nhật.`,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
