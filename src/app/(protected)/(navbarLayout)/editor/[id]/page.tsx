"use client";
import EditorDrawer from "@/components/editor/EditorDrawer";
import HeurlyEditor from "@/components/editor/HeurlyEditor";
import UserProfile from "@/components/profile/UserProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { TLog, log } from "@/logger/logger";
import { getNotes, updateNotesContent, updateNotesTitle } from "@/server/notes";
import { SaveState } from "@/types/notes";
import type { Notes } from "@prisma/client";
import {
    CircleCheck,
    CircleX,
    EllipsisVertical,
    LoaderCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { EditorInstance, JSONContent } from "novel";
import type React from "react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
    params: { id: string };
}

const NotesEditor: React.FunctionComponent<Props> = ({ params }) => {
    const session = useSession();
    const [shrink, setShrink] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [saveState, setSaveState] = useState<SaveState>(SaveState.Saved);
    const [dbNotes, setDbNotes] = useState<Notes | undefined>(undefined);
    const [localNotes, setLocalNotes] = useLocalStorage<Notes | undefined>(
        `editor-${params.id}`,
        undefined,
    );

    const getDbNotes = async (id: string) => {
        const dbNotes = await getNotes(id);
        if (dbNotes == null) return;
        setDbNotes(dbNotes);
    };

    const updates = useDebouncedCallback(async (editor?: EditorInstance) => {
        if (localNotes === undefined) return;

        const newNotes = localNotes;
        if (editor !== undefined) {
            const json = editor.getJSON();
            newNotes.content = json;
            newNotes.updatedAt = new Date();
        }

        if (dbNotes?.title !== newNotes.title) {
            try {
                const r: { success: boolean; message: string } =
                    await updateNotesTitle(newNotes.id, newNotes.title);
                if (!r.success) {
                    throw new Error(
                        "Error occured while trying to update notes title.",
                    );
                }
                setLocalNotes(newNotes);
                setDbNotes(newNotes);
                setSaveState(SaveState.Saved);
                log({ type: TLog.info, text: "Saved editor title to db." });
            } catch (e) {
                log({
                    type: TLog.error,
                    text: "Could not save editor title to db.",
                });
            }
        }

        try {
            const r: { success: boolean; message: string } =
                await updateNotesContent(
                    newNotes.id,
                    JSON.stringify(newNotes.content),
                );

            if (!r.success) {
                throw new Error("Error occured while trying to update notes.");
            }

            setLocalNotes(newNotes);
            setSaveState(SaveState.Saved);
            log({ type: TLog.info, text: "Saved editor content to db." });
        } catch (e) {
            setSaveState(SaveState.Error);
            log({
                type: TLog.error,
                text: "Could not save editor content to db.",
            });
        }
    }, 500);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (dbNotes?.updatedAt === undefined) return;

        if (
            localNotes === undefined ||
            dbNotes.updatedAt > localNotes?.updatedAt
        ) {
            setLocalNotes(dbNotes);
        }
    }, [params.id, localNotes, dbNotes, setLocalNotes]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        void getDbNotes(params.id);
    }, [params.id]);

    return (
        <div className="size-full">
            {localNotes !== undefined &&
                session?.data?.user?.id !== undefined &&
                (localNotes.userId === session.data.user.id ||
                    localNotes.public) && (
                    <Card className="size-full rounded-xl p-2">
                        <div
                            className="flex size-full flex-col overflow-x-hidden overflow-y-scroll bg-white"
                            onScroll={(e) => {
                                setShrink(e.currentTarget.scrollTop > 50);
                            }}
                        >
                            {shrink ? (
                                <div className="sticky top-0 z-40 mb-2 flex h-10 flex-row items-center gap-2 bg-white p-2 align-middle text-sm text-slate-400">
                                    <p>{localNotes.title}</p>
                                    {session.data.user.id ===
                                    localNotes.userId ? (
                                        <div>
                                            {saveState === SaveState.Saved && (
                                                <CircleCheck size={15} />
                                            )}
                                            {saveState === SaveState.Error && (
                                                <CircleX size={15} />
                                            )}
                                            {saveState === SaveState.Saving && (
                                                <LoaderCircle
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <UserProfile
                                            userId={localNotes.userId}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="sticky top-0 flex flex-row items-center justify-between bg-white p-6">
                                    <div className="w-2/3">
                                        <Input
                                            className="!border-none !text-xl font-bold md:!text-3xl"
                                            type="text"
                                            disabled={
                                                session.data?.user.id !==
                                                localNotes.userId
                                            }
                                            value={localNotes?.title ?? ""}
                                            placeholder="Nom du document"
                                            onChange={(event) => {
                                                if (localNotes === undefined)
                                                    return;
                                                setLocalNotes({
                                                    ...localNotes,
                                                    title: event.target.value,
                                                });
                                                void updates();
                                            }}
                                        />
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        {session.data.user.id ===
                                        localNotes.userId ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 rounded-xl bg-slate-200 p-2 text-sm text-slate-400">
                                                    {saveState ===
                                                        SaveState.Saved && (
                                                        <CircleCheck
                                                            size={18}
                                                        />
                                                    )}
                                                    {saveState ===
                                                        SaveState.Error && (
                                                        <CircleX size={18} />
                                                    )}
                                                    {saveState ===
                                                        SaveState.Saving && (
                                                        <LoaderCircle
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    <p className="hidden align-middle md:visible">
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
                                                userId={localNotes.userId}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            {session.data.user.id === localNotes.userId && (
                                <EditorDrawer
                                    open={drawerOpen}
                                    setOpen={setDrawerOpen}
                                    notes={localNotes}
                                    setNotes={(n) => {
                                        setLocalNotes(n);
                                        void updates();
                                    }}
                                />
                            )}
                            <CardContent className="size-full">
                                <HeurlyEditor
                                    className="size-full"
                                    canEdit={
                                        session.data.user.id ===
                                        localNotes.userId
                                    }
                                    debouncedUpdates={updates}
                                    initialContent={
                                        localNotes?.content as JSONContent
                                    }
                                    setSaveState={setSaveState}
                                />
                            </CardContent>
                        </div>
                    </Card>
                )}
        </div>
    );
};

export default NotesEditor;
