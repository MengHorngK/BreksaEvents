'use client';
import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
    const handleClick = () => {
        posthog.capture("explore_events_clicked");
    };

    return (
        <button
            type="button"
            id="explore-btn"
            className="mt-7 mx-auto flex items-center justify-center"
            onClick={handleClick}
        >
            <a
                href="#events"
                className="flex items-center justify-center gap-2"
            >
                <span>Explore Events</span>

                <Image
                    src="/icons/arrow-down.svg"
                    alt="arrow-down"
                    width={20}
                    height={20}
                />
            </a>
        </button>
    )
}
export default ExploreBtn
