import {
    createNotes,
    getCourseDateNotesPublic,
    getCourseDateNotesUser,
} from "@/server/notes";
import { getCourseDataQuestions } from "@/server/question";
import type { TEventClickArg } from "@/types/timetable";
import ID from "@/utils/id";
import type { Notes, Question } from "@prisma/client";
import { format } from "date-fns";
import {
    MessageCircleQuestion,
    Pencil,
    SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from "../ui/drawer";
import { Separator } from "../ui/separator";

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
    const [notesPublic, setNotesPublic] = useState<Notes[]>([]);
    const [notesUser, setNotesUser] = useState<Notes[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(
        window.innerWidth < nbPxPhone,
    );

    const createNotesAndRedirect = async () => {
        if (
            eventInfo?.event?._def?.extendedProps?.courseId === undefined ||
            eventInfo?.event?._instance?.range?.start === undefined
        )
            return;

        const correctDate = new Date(
            eventInfo.event._instance.range.start.getTime() +
                eventInfo.event._instance.range.start.getTimezoneOffset() *
                    60000,
        );
        const notes = await createNotes(
            `${eventInfo.event?._def?.title} - ${format(
                eventInfo.event._instance.range.start,
                "dd/MM/yyyy",
            )}`,
            {
                courseId: eventInfo.event._def.extendedProps.courseId,
                courseDate: correctDate,
            },
        );
        if (notes?.id === undefined) return;

        router.push(`editor/${notes.id}`);
    };

    useEffect(() => {
        if (
            eventInfo?.event?._def?.extendedProps?.courseId === undefined ||
            eventInfo?.event?._instance?.range?.start === undefined
        )
            return;

        // It seems that Fullcalendar returns a date as it is shown in the timetable (ex. 08/04/2024 08:00)
        // It raises an issues because the date is not being placed into its timezone.
        // Then, when we use eventInfo.event._instance.range.start, we get 08/04/2024 08:00 to which a timezone is added, resulting in a wrong date. (ex. 08/04/2024 10:00)
        const correctedCourseDate = new Date(
            eventInfo.event._instance.range.start.getTime() +
                eventInfo.event._instance.range.start.getTimezoneOffset() *
                    60000,
        );
        void getCourseDateNotesPublic({
            courseId: eventInfo.event._def.extendedProps.courseId,
            courseDate: correctedCourseDate,
        }).then((r) => setNotesPublic(r ?? []));

        void getCourseDateNotesUser({
            courseId: eventInfo.event._def.extendedProps.courseId,
            courseDate: correctedCourseDate,
        }).then((r) => setNotesUser(r ?? []));

        void getCourseDataQuestions({
            courseId: eventInfo.event._def.extendedProps.courseId,
            courseDate: correctedCourseDate,
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
                                    {`${
                                        eventInfo.event._instance?.range
                                            ?.start !== undefined
                                            ? eventInfo.event._instance?.range?.start
                                                  ?.toISOString()
                                                  .split("T")[1]
                                                  ?.split(".")[0]
                                                  ?.slice(0, 5) ?? ""
                                            : ""
                                    } - 
                                    ${
                                        eventInfo.event._instance?.range
                                            ?.end !== undefined
                                            ? eventInfo.event._instance?.range?.end
                                                  ?.toISOString()
                                                  .split("T")[1]
                                                  ?.split(".")[0]
                                                  ?.slice(0, 5) ?? ""
                                            : ""
                                    }`}{" "}
                                </p>
                            </div>
                        </div>
                        <Separator className="my-5 border-b" />
                        <div className="flex w-full flex-col">
                            {notesUser?.length > 0 && (
                                <p className="text-xl font-bold">Mes notes :</p>
                            )}
                            {notesUser?.length > 0 &&
                                notesUser.map((n) => (
                                    <ItemsLink
                                        key={ID()}
                                        title={n.title}
                                        link={`/editor/${n.id}`}
                                    />
                                ))}

                            {notesPublic?.length > 0 && (
                                <p className="text-xl font-bold">
                                    Ils ont pris des notes :{" "}
                                </p>
                            )}

                            {notesPublic?.length > 0 &&
                                notesPublic.map((n) => (
                                    <ItemsLink
                                        key={ID()}
                                        title={n.title}
                                        link={`/editor/${n.id}`}
                                    />
                                ))}
                            {notesUser?.length === 0 && (
                                <Button
                                    onClick={createNotesAndRedirect}
                                    className="mt-4"
                                >
                                    <Pencil className="mr-2" />
                                    <p>Prendre des notes</p>
                                </Button>
                            )}
                        </div>
                        <Separator className="my-5 border-b" />
                        <div className="flex w-full flex-col">
                            <p className="text-xl font-bold">
                                Ils en discutent :{" "}
                            </p>
                            {questions?.length > 0 &&
                                questions.map((q) => (
                                    <ItemsLink
                                        key={ID()}
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
