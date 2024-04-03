import { createNotes, getCourseDateNotes } from "@/server/notes";
import { TEventClickArg } from "@/types/timetable";
import { Notes, Question } from "@prisma/client";
import { format } from "date-fns";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    MessageCircleQuestion,
    Pencil,
    SquareArrowOutUpRight,
} from "lucide-react";
import { getCourseDataQuestions } from "@/server/question";

const DATE_FORMAT = "HH:mm";
const nbPxPhone = 768;

interface Props {
    eventInfo: TEventClickArg;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const ItemsLink = ({ title, link }: { title: string; link: string }) => (
    <div className="flex w-full items-center gap-2 hover:cursor-pointer">
        <SquareArrowOutUpRight size={18} />
        <Link
            className="w-5/6 overflow-hidden text-ellipsis text-nowrap underline"
            href={link}
        >
            {title}
        </Link>
    </div>
);

const TimetableDrawer: React.FunctionComponent<Props> = ({
    eventInfo,
    open,
    setOpen,
}) => {
    const router = useRouter();
    const [notes, setNotes] = useState<Notes[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(
        window.innerWidth < nbPxPhone,
    );

    const createNotesAndRedirect = async () => {
        if (
            eventInfo?.event?._def?.extendedProps?.code === undefined ||
            eventInfo?.event?._instance?.range?.start === undefined
        )
            return;

        const notes = await createNotes(
            `${eventInfo.event?._def?.title} - ${format(eventInfo.event._instance.range.start, "dd/MM/yyyy")}`,
            {
                courseCode: eventInfo.event._def.extendedProps.code,
                courseDate: eventInfo.event._instance.range.start,
            },
        );
        if (notes?.id === undefined) return;

        router.push(`editor/${notes.id}`);
    };

    useEffect(() => {
        if (
            eventInfo?.event?._def?.extendedProps?.code === undefined ||
            eventInfo?.event?._instance?.range?.start === undefined
        )
            return;

        void getCourseDateNotes({
            courseCode: eventInfo.event._def.extendedProps.code,
            courseDate: eventInfo.event._instance.range.start,
        }).then((r) => setNotes(r ?? []));

        void getCourseDataQuestions({
            courseCode: eventInfo.event._def.extendedProps.code,
            courseDate: eventInfo.event._instance.range.start,
        }).then((r) => setQuestions(r ?? []));
    }, [eventInfo]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < nbPxPhone);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    return (
        <div onClick={() => setOpen(false)}>
            <Drawer
                open={open}
                direction={isMobile ? "bottom" : "right"}
                onClose={() => setOpen(false)}
            >
                <DrawerContent
                    className="left-[unset] right-0 flex h-full w-full flex-col p-6 md:w-[500px]"
                    onEscapeKeyDown={() => setOpen(false)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DrawerHeader>
                        <h1 className="my-5 flex w-full flex-col justify-center">
                            <p className="align-middle text-3xl font-bold">
                                {eventInfo.event._def.extendedProps.name ??
                                    eventInfo.event._def.title}
                            </p>
                            <p className="align-middle text-xl">
                                {eventInfo.event._def.extendedProps.type ?? ""}
                            </p>
                        </h1>
                    </DrawerHeader>
                    <div className="h-full w-full p-2">
                        <Separator className="my-5 border-b" />
                        <div className="flex">
                            <div className="flex w-1/2 flex-col items-start">
                                <p className="text-xl font-bold">Lieu</p>
                                <p>{eventInfo.event._def.extendedProps.room}</p>
                            </div>
                            <div className="flex w-1/2 flex-col items-end">
                                <p className="text-xl font-bold">Horaire</p>
                                <p>
                                    {eventInfo.event._instance?.range?.start !==
                                        undefined &&
                                    eventInfo.event._instance?.range?.end !==
                                        undefined
                                        ? `${format(eventInfo.event._instance?.range?.start, DATE_FORMAT)} - ${format(eventInfo.event._instance?.range?.end, DATE_FORMAT)}`
                                        : "---"}
                                </p>
                            </div>
                        </div>
                        <Separator className="my-5 border-b" />
                        <div className="flex w-full flex-col">
                            <p className="text-xl font-bold">
                                Ils ont pris des notes :{" "}
                            </p>
                            {notes?.length > 0 &&
                                notes.map((n, i) => (
                                    <ItemsLink
                                        key={i}
                                        title={n.title}
                                        link={`/editor/${n.id}`}
                                    />
                                ))}
                            <Button
                                onClick={createNotesAndRedirect}
                                className="mt-4"
                            >
                                <Pencil className="mr-2" />
                                <p>Prendre des notes</p>
                            </Button>
                        </div>
                        <Separator className="my-5 border-b" />
                        <div className="flex w-full flex-col">
                            <p className="text-xl font-bold">
                                Ils en discutent :{" "}
                            </p>
                            {questions?.length > 0 &&
                                questions.map((q, i) => (
                                    <ItemsLink
                                        key={i}
                                        title={q.question}
                                        link={`/revision/QandA/question/${q.id}`}
                                    />
                                ))}
                            <Button className="mt-4">
                                <MessageCircleQuestion className="mr-2" />
                                <p>En discuter</p>
                            </Button>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Fermer
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default TimetableDrawer;
