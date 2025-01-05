import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import User from "@/models/user";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

//get User by UserID
export async function GET(req, { params }) {
    try {
        await connectToDB();
        const userInfo = await User.findOne({ userId: params.id });
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

// delete User
export async function DELETE(req, { params }) {
    const authError = await authorize(["manager"]);
    if (authError) return authError;
    
    try {
        await connectToDB();
        const currentUser = await User.findByIdAndDelete(params.id)
        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: messages.deleteUser.USER_NOT_FOUND
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            messages: messages.deleteUser.SUCCESS,
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: messages.deleteUser.ERROR
        }, { status: 500 });
    }
}
