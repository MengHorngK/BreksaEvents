import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { role } = await req.json();

        if (role !== "mentor" && role !== "mentee") {
            return NextResponse.json(
                { message: "Invalid role" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const normalizedEmail = session.user.email.toLowerCase().trim();

        const updatedUser = await User.findOneAndUpdate(
            { email: normalizedEmail },
            {
                $set: {
                    role,
                    name: session.user.name || "",
                    email: normalizedEmail,
                    image: session.user.image || "",
                },
                $setOnInsert: {
                    kickoffStatus: "not_started",
                    canBookMentor: false,
                },
            },
            {
                new: true,
                upsert: true,
            }
        );

        return NextResponse.json(
            {
                success: true,
                user: {
                    email: updatedUser.email,
                    role: updatedUser.role,
                    provider: updatedUser.provider,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Role update error:", error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}