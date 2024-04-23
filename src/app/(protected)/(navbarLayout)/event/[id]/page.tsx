import EventCard from "@/components/event/event-card";
import { getServerAuthSession } from "@/server/auth";
import { getEventById, getEvents } from "@/server/event";
import { redirect } from "next/navigation";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props) {
    const event = await getEventById(params.id);
    if (!event) return null;
    const title = event?.event;
    const description = event?.description;
    return {
        title,
        description,
    };
}

export default async function EventPage({
    params,
}: {
    params: { id: string };
}) {
    if (!params.id) redirect("/404");

    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    const eventsDb =
        await getEvents();
        // params.id,
        // session.user.id,
    if (!eventsDb) redirect("/404");

    return (
        <div className="flex h-full w-full flex-col items-center gap-y-5 overflow-auto">
            {/* <EventCard
                id={eventsDb.id}
                title={eventsDb.event}
                description={eventsDb.description}
                urlImage={eventsDb.urlImage}
                location={eventsDb.location}
                eventDate={eventsDb.eventDate}
                className="sticky top-0 z-10"
            /> */}
        </div>
    );
}
