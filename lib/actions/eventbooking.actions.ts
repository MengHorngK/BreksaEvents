'use server';

import connectToDatabase from "@/lib/mongodb";
import Booking from "@/database/booking.model";

export const createEventBooking = async ({
                                             eventId,
                                             slug,
                                             email,
                                         }: {
    eventId: string;
    slug: string;
    email: string;
}) => {
    try {
        await connectToDatabase();

        const booking = await Booking.create({
            eventId,
            slug,
            email,
        });

        return {
            success: true,
            booking: JSON.parse(JSON.stringify(booking)),
        };
    } catch (e) {
        console.error("create event booking failed", e);

        return {
            success: false,
            error: e instanceof Error ? e.message : "Unknown error",
        };
    }
};