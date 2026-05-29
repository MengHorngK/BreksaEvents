'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function Providers({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        posthog.init(
            process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
            {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            }
        );

        // test event
        posthog.capture('posthog_initialized');
    }, []);

    return <>{children}</>;
}