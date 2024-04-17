import Logo from "@/components/icon/Logo";
import { getDocById } from "@/server/docs";
import { getUserPublicInfo } from "@/server/user";
import { Docs } from "@prisma/client";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export async function GET({ document }: { document: Docs }) {
    if (document) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 128,
                        background: "white",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {document.title}
                </div>
            ),
            {
                width: 1200,
                height: 600,
            },
        );
    } else {
        const docId = "clv2mrwnx0001h24gh0b5k4uk";
        let fetchedDoc = null;
        try {
            fetchedDoc = await getDocById(docId);
        } catch (error) {
            console.error("Doc not found :", error);
        }
        if (!fetchedDoc) {
            return notFound();
        }

        const user = await getUserPublicInfo(fetchedDoc.userId);

        if (!user || user.name === "" || user.image === "") {
            return notFound();
        }
        return new ImageResponse(
            (
                // <div
                //     style={{
                //         height: "100%",
                //         width: "100%",
                //         display: "flex",
                //         flexDirection: "column",
                //         alignItems: "center",
                //         justifyContent: "center",
                //         backgroundColor: "#fff",
                //         fontSize: 32,
                //         fontWeight: 600
                //     }}
                // >
                //     <Logo/>
                //     <div style={{ marginTop: 10 }}>You are on /works-too/</div>
                //     <div style={{ marginTop: 10 }}>{fetchedDoc.title}</div>
                // </div>
                // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections

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
                                tw="border-2 border-white rounded-full"
                            />
                        </div>
                        <div tw="mt-16 flex text-6xl leading-normal text-gray-200">
                            {fetchedDoc.title}
                        </div>
                        <div tw="mt-5 flex text-3xl text-gray-300">
                            {fetchedDoc.description}
                        </div>
                        <div tw="mt-5 flex items-center text-xl text-gray-300">
                            <div>{user.name}</div>
                            <div tw="-mt-2 ml-3">.</div>
                            <div tw="ml-3">
                                {fetchedDoc.updatedAt.toLocaleDateString()}
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
}
