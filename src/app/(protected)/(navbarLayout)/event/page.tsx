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
        <div className="w-full mb-20">
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
                            className="flex flex-col md:flex-row md:px-5 items-center justify-center overflow-hidden"
                        >
                            <img
                                src={urlImage}
                                alt={`${event}`}
                                width={150}
                                height={150}
                                className="md:rounded-lg md:aspect-square w-full md:w-40"
                            />
                            <div>
                                <CardHeader className="flex md:block items-center justify-center">
                                    <h3 className="text-xl font-bold">
                                        {event}
                                    </h3>
                                    <div className="flex gap-x-3 md:hidden">
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
                                    </div>
                                </CardHeader>
                                <CardContent className="flex md:block items-center justify-center">
                                    <p className="w-11/12 ">
                                        <TextTruncated
                                            maxLength={200}
                                            text={description}
                                        />
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <div className="hidden md:flex gap-x-5 text-sm">
                                        <div className="flex  gap-x-1 items-center justify-center">
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
                                    </div>
                                    <Button className="md:hidden block flex-1">
                                        Intéressé
                                    </Button>
                                </CardFooter>
                            </div>
                            <Button className="hidden md:block">
                                Intéressé
                            </Button>
                        </Card>
                    );
                },
            )}
            {events?.length === 0 && <p>Aucun event</p>}
        </div>
    );
}
