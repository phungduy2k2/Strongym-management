import { users } from "@clerk/nextjs";

// Vào Clerk Dashboard, thêm Webhook cho sự kiện user:created
// Do đang chạy local nên chưa thêm endpoint được
export async function POST(req) {
  try {
    const payload = await req.json();

    // Kiểm tra sự kiện từ Clerk
    if (payload.type === "user.created") {
      const userId = payload.data.id;

      // Cập nhật publicMetadata với role mặc định là "member"
      await users.updateUser(userId, {
        publicMetadata: {
          role: "member",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error handling Clerk webhook:", err);
    return NextResponse.json({ success: false, error: "Webhook handling failed" }, { status: 500 });
  }
}
