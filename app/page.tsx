import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import type { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async() => {
    const response = await fetch(`${BASE_URL}/api/event`);
    const data = await response.json();
    const events = data.events;
    return (
        <section>
            <h1 className="text-center"> Events that help you <br/> turn your Ambition into Admission</h1>
            <p className="text-center mt-3">Scholarship Bootcamp, Workshop, Event, All in One Place</p>

            <ExploreBtn/>

            <div className="mt-5 space-y-2">
                <h3>Featured Events</h3>

                <ul className="events list-none p-0">
                    {events.map((event: IEvent) => (
                        <li key={event.slug || event.title}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>


            </div>
        </section>
    )
}
export default Page
