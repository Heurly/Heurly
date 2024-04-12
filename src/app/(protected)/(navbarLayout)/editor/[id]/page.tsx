"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getNotes, updateNotes } from "@/server/notes";
import { Notes } from "@prisma/client";
import HeurlyEditor from "@/components/editor/HeurlyEditor";
import { EditorInstance, JSONContent } from "novel";
import { useDebouncedCallback } from "use-debounce";
import { CircleCheck, EllipsisVertical, LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import UserProfile from "@/components/profile/UserProfile";
import { TLog, log } from "@/logger/logger";
import useLocalStorage from "@/hooks/useLocalStorage";
import { SaveState } from "@/types/notes";
import EditorDrawer from "@/components/editor/EditorDrawer";

interface Props {
    params: { id: string };
}

const NotesEditor: React.FunctionComponent<Props> = ({ params }) => {
    const session = useSession();
    const [shrink, setShrink] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [saveState, setSaveState] = useState<SaveState>(SaveState.Saved);
    const [notes, setNotes] = useLocalStorage<Notes | undefined>(
        "editor",
        undefined,
    );

    const updates = useDebouncedCallback(async (editor?: EditorInstance) => {
        if (notes === undefined) return;

        log({ type: TLog.info, text: "Saved editor content to db." });
        const newNotes = notes;
        if (editor !== undefined) {
            const json = editor.getJSON();
            newNotes.content = json;
            newNotes.updatedAt = new Date();
        }

        void updateNotes(newNotes);
        setNotes(newNotes);
        setSaveState(SaveState.Saved);
    }, 500);

    useEffect(() => {
        const getNotesData = async () => {
            const dbNotes = await getNotes(params.id);
            if (dbNotes == null) return;
            setNotes(dbNotes);
        };

        if (notes === undefined) {
            void getNotesData();
        }
    }, [params.id, notes, setNotes]);

    return (
        <div className="h-full w-full">
            {notes !== undefined &&
                session?.data?.user?.id !== undefined &&
                (notes.userId === session.data.user.id || notes.public) && (
                    <Card className="size-full rounded-xl p-2">
                        <ScrollArea
                            className="flex size-full flex-col bg-white"
                            onScroll={(e) => {
                                setShrink(e.currentTarget.scrollTop > 50);
                            }}
                        >
                            {shrink ? (
                                <div className="sticky top-0 z-40 mb-2 flex h-10 flex-row items-center gap-2 bg-white p-2 align-middle text-sm text-slate-400">
                                    <p>{notes.title}</p>
                                    {session.data.user.id === notes.userId ? (
                                        <div>
                                            {saveState === SaveState.Saved && (
                                                <CircleCheck size={15} />
                                            )}
                                            {saveState === SaveState.Saving && (
                                                <LoaderCircle
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <UserProfile userId={notes.userId} />
                                    )}
                                </div>
                            ) : (
                                <div className="sticky top-0 flex flex-col items-center justify-between bg-white p-6 md:flex-row">
                                    <div className="md:w-1/2">
                                        <Input
                                            className="!border-none !text-xl font-bold md:!text-3xl"
                                            type="text"
                                            disabled={
                                                session.data?.user.id !==
                                                notes.userId
                                            }
                                            value={notes?.title ?? ""}
                                            placeholder="Nom du document"
                                            onChange={(event) => {
                                                if (notes === undefined) return;
                                                setNotes({
                                                    ...notes,
                                                    title: event.target.value,
                                                });
                                                void updates();
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center md:w-1/6">
                                        {session.data.user.id ===
                                        notes.userId ? (
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-1 rounded-xl bg-slate-200 p-2 text-sm text-slate-400">
                                                    {saveState ===
                                                        SaveState.Saved && (
                                                        <CircleCheck
                                                            size={18}
                                                        />
                                                    )}
                                                    {saveState ===
                                                        SaveState.Saving && (
                                                        <LoaderCircle
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    <p className="align-middle">
                                                        {saveState}
                                                    </p>
                                                </div>
                                                <EllipsisVertical
                                                    size={25}
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setDrawerOpen(true)
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <UserProfile
                                                userId={notes.userId}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            {session.data.user.id === notes.userId && (
                                <EditorDrawer
                                    open={drawerOpen}
                                    setOpen={setDrawerOpen}
                                    notes={notes}
                                    setNotes={(n) => {
                                        setNotes(n);
                                        void updates();
                                    }}
                                />
                            )}
                            <CardContent className="size-full">
                                <HeurlyEditor
                                    canEdit={
                                        session.data.user.id === notes.userId
                                    }
                                    className="size-full"
                                    debouncedUpdates={updates}
                                    initialContent={
                                        notes?.content as JSONContent
                                    }
                                    setSaveState={setSaveState}
                                />
                            </CardContent>
                        </ScrollArea>
                    </Card>
                )}
        </div>
    );
};

export default NotesEditor;
