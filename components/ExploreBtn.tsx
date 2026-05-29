'use client';

import Image from "next/image";

const ExploreBtn = () => {
    return (
        <a href="#events" id="explore-btn">
            <span>Explore Events</span>

            <Image
                src="/icons/arrow-down.svg"
                alt="arrow-down"
                width={18}
                height={18}
            />
        </a>
    );
};

export default ExploreBtn;