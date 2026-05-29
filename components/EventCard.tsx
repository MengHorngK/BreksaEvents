import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({
                       title,
                       image,
                       slug,
                       location,
                       date,
                       time,
                   }: Props) => {

    const formattedDate = new Date(date).toISOString().split("T")[0];

    return (
        <Link href={`/event/${slug}`} id="events-card">
            <Image
                src={image}
                alt={title}
                width={470}
                height={300}
                className="poster"
            />

            <p className="title mt-4\">{title}</p>

            {/* Location */}
            <div className="flex items-center gap-2 mt-2 text-sm text-[#1700A8]">
                <Image
                    src="/icons/pin.svg"
                    alt="location"
                    width={14}
                    height={14}
                />
                <p>{location}</p>
            </div>

            {/* Date & Time */}
            <div className="datetime mt-3">
                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/calendar.svg"
                        alt="date"
                        width={14}
                        height={14}
                    />
                    <p>{formattedDate}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/clock.svg"
                        alt="time"
                        width={14}
                        height={14}
                    />
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;