'use server';

import connectToDatabase from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

const normalizeTags = (tags: string[]): string[] => {
    if (!Array.isArray(tags)) return [];

    if (
        tags.length === 1 &&
        typeof tags[0] === "string" &&
        tags[0].trim().startsWith("[")
    ) {
        try {
            return JSON.parse(tags[0]);
        } catch {
            return tags;
        }
    }

    return tags;
};

export const getSimilarEventsBySlug = async (
    slug: string
): Promise<IEvent[]> => {
    try {
        await connectToDatabase();

        const event = await Event.findOne({ slug }).lean();

        if (!event) return [];

        const normalizedTags = normalizeTags(event.tags);

        console.log("CURRENT SLUG:", slug);
        console.log("CURRENT TAGS:", event.tags);
        console.log("NORMALIZED TAGS:", normalizedTags);

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: normalizedTags },
        })
            .limit(3)
            .lean();

        console.log("SIMILAR EVENTS FOUND:", similarEvents.length);

        return JSON.parse(JSON.stringify(similarEvents));
    } catch (e) {
        console.log("Error getting similar events:", e);
        return [];
    }
};