import { authorize } from "@/lib/middleware";
import { messages } from "@/utils/message";
import { createClerkClient } from "@clerk/backend"
import { NextResponse } from "next/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

// create new Clerk account
export async function POST(req) {
    const authError = await authorize(["manager"]);
    if (authError) return authError;
    
    try {
        const { username, email, role } = await req.json();

        const newClerkAccount = await clerkClient.users.createUser({
            username: username,
            emailAddress: [email],
            password: process.env.DEFAULT_PASSWORD || "strongym01112002",
            publicMetadata: {
                "role": role
            }
        })
        return NextResponse.json({
            success: true,
            message: messages.createClerkAccout.SUCCESS,
            data: newClerkAccount
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
          success: false,
          message: messages.createClerkAccout.ERROR,
        }, { status: 500 });
    }
}
