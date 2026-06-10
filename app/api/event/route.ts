import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

const parseStringArray = (value: FormDataEntryValue | null): string[] => {
    if (!value || typeof value !== "string") {
        return [];
    }

    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
        if (
            parsed.length === 1 &&
            typeof parsed[0] === "string" &&
            parsed[0].trim().startsWith("[")
        ) {
            return JSON.parse(parsed[0]);
        }

        return parsed;
    }

    return [];
};

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await req.formData();

        const event = Object.fromEntries(formData.entries());

        const file = formData.get("image") as File | null;
        const formLink = formData.get("formLink") as string;
        console.log("FORM LINK FROM HTTPie:", formLink);
        console.log("ALL FORM DATA:", Object.fromEntries(formData.entries()));

        if (!file) {
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );
        }

        if (!formLink) {
            return NextResponse.json(
                { message: "Google Form link is required" },
                { status: 400 }
            );
        }

        const tags = parseStringArray(formData.get("tags"));
        const agenda = parseStringArray(formData.get("agenda"));

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string }>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { resource_type: "image", folder: "breksa-event" },
                        (error, result) => {
                            if (error || !result) {
                                reject(error);
                            } else {
                                resolve(result as { secure_url: string });
                            }
                        }
                    )
                    .end(buffer);
            }
        );

        const createdEvent = await Event.create({
            ...event,
            image: uploadResult.secure_url,
            tags,
            agenda,
            formLink,
        });

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                message: "Event creation failed",
                error: e instanceof Error ? e.message : "Unknown",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json(
            { message: "Events fetched successfully", events },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: "Event fetching failed", error: e },
            { status: 500 }
        );
    }
}