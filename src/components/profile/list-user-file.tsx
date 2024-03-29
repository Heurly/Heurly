"use client";
import { deleteUserDoc, getDocsByUser } from "@/server/docs";
import type { Docs, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ID from "@/utils/id";
import Link from "next/link";
import { FileText, Trash } from "lucide-react";
import cn from "classnames";

type PropsListUserFile = {
    userId: User["id"];
    className?: string;
    userDocs?: Docs[];
};

const ListUserFile = React.forwardRef<HTMLDivElement, PropsListUserFile>(
    ({ userId, className, userDocs }, ref) => {
        const [docs, setDocs] = useState<Docs[]>(userDocs ?? []);

        useEffect(() => {
            const fetchData = async () => {
                const data = await getDocsByUser(userId);
                setDocs(data);
            };
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            fetchData();
        }, [userId]);

        return (
            <div className={cn(className)} ref={ref}>
                {docs.map(({ id: docsId, title }) => (
                    <Link href={`/QandA/docs/${docsId}`} key={ID()}>
                        <Card
                            key={ID()}
                            className="relative cursor-pointer p-10"
                        >
                            <Link href="#">
                                <div
                                    className="absolute right-0 top-0 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border bg-white transition hover:bg-red-300"
                                    onClick={async () => {
                                        await deleteUserDoc(docsId, userId);
                                    }}
                                >
                                    <Trash />
                                </div>
                            </Link>
                            <FileText />
                            {title}
                        </Card>
                    </Link>
                ))}
            </div>
        );
    },
);

ListUserFile.displayName = "ListUserFile";
export default ListUserFile;
