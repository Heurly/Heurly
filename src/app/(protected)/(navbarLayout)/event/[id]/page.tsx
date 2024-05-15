import { getServerAuthSession } from "@/server/auth";
import { getEventById, getEvents } from "@/server/event";
import { notFound, redirect } from "next/navigation";

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
    if (!params.id) notFound();

    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    const eventsDb = await getEvents();

    if (!eventsDb) notFound();

    return (
        <div className="flex h-full w-full flex-col items-center gap-y-5 overflow-auto"></div>
    );
}
