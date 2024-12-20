import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'

export async function authorize(requiredRoles = []) {
    try {
        const { userId, sessionClaims } = await auth()
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const userRole = sessionClaims?.publicMetadata?.role;

        // Check if user has the required role
        if (requiredRoles.length && !requiredRoles.some((role) => userRole.includes(role))) {
            return NextResponse.json({
                success: false,
                message: "Access denied"
            }, { status: 403 })
        }

        return null;
    } catch(err) {
        console.error(err)
        return NextResponse.json({
            success: false,
            message: "Invalid or expired token"
        }, { status: 401 });
    }
}
