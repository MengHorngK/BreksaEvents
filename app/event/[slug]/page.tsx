import { notFound } from "next/navigation";
import Image from "next/image";
import {IEvent} from "@/database/event.model";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventDetailItem =({icon,alt,label}:{icon:string;alt:string;label:string}) =>{
    return(
        <div className={"flex flex-row-gap-2 items-center"}>
            <Image src={icon} alt={alt} width={17} height={17}/>
            <p>{label}</p>
        </div>

        )

}

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => {
    return (
        <div className="agenda">
            <h2>Agenda</h2>
            <ul>
                {agendaItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

const EventTags = ({tags}: {tags: string[]}) => {
    return (
        <div className="flex flex-row-gap-2 flex-wrap">
            {tags.map((tag) => (
                <div className="pill" key={tag} > {tag}</div>
            ))}
        </div>
    )
}

const EventDetailsPage = async ({params,}: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await params;
    const request = await fetch(`${BASE_URL}/api/event/${slug}`, {
        cache: "no-store",
    });

    if (!request.ok) return notFound();

    const data = await request.json();

    const event = data.event ?? data;
    console.log("EVENT DATA:", event);
    console.log("FORM LINK:", event.formLink);
    if (!event) return notFound();

    const {
        description,
        image,
        overview,
        date,
        time,
        location,
        mode,
        agenda,
        audience,
        tags,
        organizer,

    } = event;

    if (!description) return notFound();
    const bookings =10;
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
    console.log(similarEvents);

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image
                        src={image}
                        alt="Event Banner"
                        width={800}
                        height={800}
                        className="banner"
                    />
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date.split("T")[0]}/>
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time}/>
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location}/>
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience}/>

                    </section>
                    <EventAgenda agendaItems={(agenda)}/>

                    <section className={"flex flex-row-gap-2"}>
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>

                    </section>
                    <EventTags tags={(tags)}/>
                </div>
                <aside className="booking">
                    <div className="signup-card">
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join other people who have already booked their spot!
                            </p>
                        ) : (
                            <p className="text-sm">Be the first to book your spot!</p>
                        )}

                        {event.formLink ? (
                            <a
                                href={event.formLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#12244A]
                                px-6
                                py-3
                                text-white
                                font-semibold
                                transition-all
                                duration-200
                                hover:opacity-90
                              "
                            >
                                Book Your Spot
                            </a>
                        ) : (
                            <p className="text-sm">No Google Form link found for this event.</p>
                        )}
                    </div>
                </aside>
            </div>

            <div >

                <div className="flex w-full flex-col gap-4 pt-20">
                    <h2>Similar Events</h2>

                    <div className="events">
                        {similarEvents.length > 0 ? (
                            similarEvents.map((similarEvent: IEvent) => (
                                <EventCard
                                    key={similarEvent._id.toString()}
                                    {...similarEvent}
                                />
                            ))
                        ) : (
                            <p>No similar events found.</p>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default EventDetailsPage;