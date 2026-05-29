'use client';

import React from 'react';
import { createEventBooking } from '@/lib/actions/eventbooking.actions';
import posthog from 'posthog-js';

const BookEvent = ({
                       eventId,
                       slug,
                   }: {
    eventId: string;
    slug: string;
}) => {
    const [email, setEmail] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        console.log('Submitting booking...');

        const result = await createEventBooking({
            eventId,
            slug,
            email,
        });

        console.log('Booking result:', result);

        if (result.success) {
            console.log('Booking created successfully');
            posthog.capture(
                'event_booked',
                {
                    eventId,
                    slug,
                    email,
                },
                {
                    send_instantly: true,
                }
            );

            console.log('PostHog event sent');

            setSubmitted(true);
        } else {
            console.error('Booking creation failed:', result.error);

            posthog.capture('booking_failed', {
                eventId,
                slug,
                email,
                error: result.error,
            });

            alert('Failed to create booking. Please try again.');
        }
    };

    return (
        <div id="book-event">
            {submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>

                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="button-submit"
                    >
                        Book Now
                    </button>
                </form>
            )}
        </div>
    );
};

export default BookEvent;