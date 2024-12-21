import connectToDB from "@/database";
import Class from "@/models/class";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const today = new Date();

    //cập nhật class UPCOMING -> ACTIVE
    await Class.updateMany(
      {
        startDate: { $lte: today }, // Ngày bắt đầu <= hôm nay
        endDate: { $gte: today }, // Ngày kết thúc >= hôm nay
        status: { $ne: "ACTIVE" },
      },
      { $set: { status: "ACTIVE" } }
    );

    //cập nhật class ACTIVE -> EXPIRED
    await Class.updateMany(
        {
            endDate: { $lt: today }, // Ngày kết thúc < hôm nay
            status: { $ne: "EXPIRED" },
        },
        { $set: { status: "EXPIRED" } }
    )

    return NextResponse.json({ success: true, message: "Cập nhật trạng thái lớp thành công." });
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
