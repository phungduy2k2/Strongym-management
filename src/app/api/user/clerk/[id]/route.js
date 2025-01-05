import { authorize } from "@/lib/middleware";
import User from "@/models/user";
import { messages } from "@/utils/message";
import { createClerkClient } from "@clerk/backend"
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

//get User by employeeId
export async function GET(req, { params }) {
    const authError = await authorize(["manager"]);
    if (authError) return authError;
    
    try {
        await connectToDB();

        const userInfo = await User.findOne({ employeeId: mongoose.Types.ObjectId(params.id) });
        if (!userInfo) {
            return NextResponse.json({
                success: false,
                message: messages.getUserById.USER_NOT_FOUND
            }, { status: 409 });
        }
        return NextResponse.json({
            success: true,
            data: userInfo
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: messages.getUserById.ERROR
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const authError = await authorize(["manager"]);
    if (authError) return authError;
    
    try {
        const userId = params.id;
        
        const deletedClerkAccount = await clerkClient.users.deleteUser(userId);

        if (!deletedClerkAccount) {
            return NextResponse.json({
                success: false,
                message: messages.deleteClerkAccount.USER_NOT_FOUND
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: messages.deleteClerkAccount.SUCCESS,
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
          success: false,
          message: messages.deleteClerkAccount.ERROR,
        }, { status: 500 });
    }
}
