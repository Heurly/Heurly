import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import DateFormatted from "@/components/ui/date-formatted";
import TextTruncated from "@/components/ui/truncated-text";
import { getEvents } from "@/server/event";
import ID from "@/utils/id";
import { CalendarDays, MapPin, PersonStanding } from "lucide-react";
import Image from "next/image";

export default async function PageListEvent() {
    const events = await getEvents();
    return (
        <div>
            {events?.map(
                ({
                    event,
                    description,
                    urlImage,
                    eventDate,
                    nbUserInterested,
                    location,
                }) => {
                    return (
                        <Card
                            key={ID()}
                            className="flex p-5 items-center justify-center"
                        >
                            <img
                                src={urlImage}
                                alt={`${event}`}
                                width={200}
                                height={200}
                                className="rounded-lg aspect-square"
                            />
                            <div>
                                <CardHeader>
                                    <h3 className="text-xl font-bold">
                                        {event}
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-ellipsis overflow-hidden">
                                        <TextTruncated
                                            maxLength={200}
                                            text={description}
                                        />
                                    </p>
                                </CardContent>
                                <CardFooter className="flex gap-x-5 text-sm">
                                    <div className="flex gap-x-1 items-center justify-center">
                                        <PersonStanding />
                                        <p>{nbUserInterested}</p>
                                    </div>
                                    <div className="flex gap-x-1 items-center justify-center">
                                        <MapPin /> <p>{location}</p>
                                    </div>
                                    <div className="flex gap-x-1 items-center justify-center">
                                        <CalendarDays />
                                        <DateFormatted>
                                            {eventDate}
                                        </DateFormatted>
                                    </div>
                                </CardFooter>
                            </div>
                            <Button>Intéressé</Button>
                        </Card>
                    );
                },
            )}
            {events?.length === 0 && <p>Aucun event</p>}
        </div>
    );
}
