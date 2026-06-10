import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Opportunity from "@/database/opportunity.model";

export async function GET() {
    try {
        await connectToDatabase();

        const opportunities = await Opportunity.find()
            .sort({
                featured: -1,
                title: 1,
            })
            .lean();

        return NextResponse.json(
            {
                opportunities,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Opportunity fetching failed:", error);

        return NextResponse.json(
            {
                message: "Opportunity fetching failed",
                error,
            },
            { status: 500 }
        );
    }
}