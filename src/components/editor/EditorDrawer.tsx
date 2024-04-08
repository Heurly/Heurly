"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Course, Notes } from "@prisma/client";
import NotesVisibility from "../docs/NotesVisibility";
import { Switch } from "../ui/switch";
import { useSession } from "next-auth/react";
import CoursesSelect, { CourseOption } from "../courses/CoursesSelect";
import { ChevronDown } from "lucide-react";
import { Separator } from "../ui/separator";
import { getCourse } from "@/server/courses";

interface Props {
    notes: Notes;
    setNotes: (notes: Notes) => void;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const EditorDrawer: React.FunctionComponent<Props> = ({
    notes,
    setNotes,
    open,
    setOpen,
}) => {
    const session = useSession();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [course, setCourse] = useState<CourseOption | undefined>(undefined);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    useEffect(() => {
        const getNotesCourse = async (id: number | null) => {
            if (id == null) return;
            const c = await getCourse(id);
            if (c == null) return;
            setCourse({
                value: c.id,
                label: c.name ?? c.small_code ?? c.code,
            } as CourseOption);
        };

        void getNotesCourse(notes.courseId);
    }, [notes]);

    return (
        <div onClick={() => setOpen(false)}>
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                direction={isMobile ? "bottom" : "right"}
            >
                <DrawerContent
                    onEscapeKeyDown={() => setOpen(false)}
                    onClick={(e) => e.stopPropagation()}
                    className="left-[unset] right-0 flex h-full w-full flex-col p-6 md:w-[500px]"
                >
                    <DrawerTitle className="p-6">
                        <p className="text-3xl font-bold">Gestion de notes</p>
                        <p className="text-xl">Titre : {notes.title}</p>
                    </DrawerTitle>
                    <div className="mt-6 flex flex-col gap-4 rounded-xl border p-10">
                        <div className="flex items-center justify-between align-middle">
                            <h3 className="text-xl font-bold">Visibilité</h3>
                            <div className="flex items-center gap-4 align-middle">
                                <NotesVisibility isPublic={notes.public} />
                                <Switch
                                    disabled={
                                        session.data?.user.id !== notes.userId
                                    }
                                    onCheckedChange={async (v) => {
                                        setNotes({
                                            ...notes,
                                            public: !v,
                                        });
                                    }}
                                    checked={!notes.public}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between align-middle">
                            <h3 className="text-xl font-bold">Cours</h3>
                            <CoursesSelect
                                className="h-full"
                                value={course}
                                setValue={(v) => {
                                    setCourse(v);
                                    setNotes({
                                        ...notes,
                                        courseId: v.value,
                                    });
                                }}
                                trigger={
                                    <div className="flex size-full items-center gap-1 overflow-hidden text-ellipsis text-nowrap rounded-xl border p-2 text-slate-500">
                                        <ChevronDown size={18} />
                                        <div>
                                            {course?.label ??
                                                "Pas de cours associé."}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(false)}
                        className="mt-auto w-full"
                        variant="outline"
                    >
                        Fermer
                    </Button>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default EditorDrawer;
