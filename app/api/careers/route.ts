import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Career from "@/database/career.model";

export async function GET() {
    try {
        await connectToDatabase();

        const careers = await Career.find().sort({ featured: -1, job_title: 1 }).lean();

        return NextResponse.json({ careers }, { status: 200 });
    } catch (error) {
        console.log("Career fetching failed:", error);

        return NextResponse.json(
            {
                message: "Career fetching failed",
                error,
            },
            { status: 500 }
        );
    }
}