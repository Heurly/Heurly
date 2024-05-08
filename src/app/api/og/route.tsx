/* eslint-disable @next/next/no-img-element */
/* eslint-disable-next-line @next/next/no-img-element */

import { getDocById } from "@/server/docs";
import { getUserPublicInfo } from "@/server/user";
import type { Docs } from "@prisma/client";
import { ImageResponse } from "next/og";

export async function GET(request: Request): Promise<ImageResponse> {
    const { searchParams } = new URL(request.url);
    const doc = searchParams.get("doc");

    if (!doc) {
        return NotFound();
    }

    const document = await getDocById(doc);
    if (!document) {
        return NotFound();
    }

    const user = await getUserPublicInfo(document.userId);
    if (!user) {
        return NotFound();
    }

    return Found({ document, user });
}

async function Found({
    document,
    user,
}: {
    document: Docs;
    user: { name: string | null; image: string | null };
}) {
    if (user.image === null) {
        user.image = "";
    }
    return new ImageResponse(
        (
            <div
                tw="p-6 h-full w-full flex justify-center items-center"
                style={{
                    background:
                        "linear-gradient(133deg, rgb(56, 182, 212) 0%, rgb(59, 130, 246) 55%, rgb(255, 255, 255) 100%)",
                    // fontFamily: '"Josefin-Sans"',
                }}
            >
                <div tw="rounded p-10 bg-zinc-900 h-full w-full flex flex-col">
                    <div tw="mt-10 mb-3 flex items-center">
                        <img
                            width="84"
                            height="84"
                            src={user.image}
                            alt="user profile"
                            tw="border-2 border-white rounded-full"
                        />
                    </div>
                    <div tw="mt-16 flex text-6xl leading-normal text-gray-200">
                        {document.title}
                    </div>
                    <div tw="mt-5 flex text-3xl text-gray-300">
                        {document.description}
                    </div>
                    <div tw="mt-5 flex items-center text-xl text-gray-300">
                        <div>{user.name}</div>
                        <div tw="-mt-2 ml-3">.</div>
                        <div tw="ml-3">
                            {document.updatedAt.toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 600,
        },
    );
}

async function NotFound() {
    return new ImageResponse(
        (
            <div
                tw="p-6 h-full w-full flex justify-center items-center"
                style={{
                    background:
                        "linear-gradient(133deg, rgb(246, 030, 033) 0%, rgb(255, 010, 000) 55%, rgb(0, 0, 0) 100%)",
                    // fontFamily: '"Josefin-Sans"',
                }}
            >
                <div tw="rounded p-10 bg-zinc-900 h-full w-full flex flex-col">
                    <div tw="mt-16 flex text-6xl leading-normal text-gray-200">
                        Not found
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 600,
        },
    );
}
