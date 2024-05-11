import { env } from "@/env";
import { getDocById } from "@/server/docs";
import type { Metadata } from "next";
import { ContentDocs } from "./content";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata | undefined> {
    const doc = await getDocById(params.id);
    if (!doc) return;
    const url = `${env.NEXTAUTH_URL}/api/og?doc=${params.id}`;
    return {
        title: doc.title,
        alternates: {
            canonical: `${env.NEXTAUTH_URL}/revision/docs/${params.id}`,
        },
        openGraph: {
            title: doc.title,
            type: "article",
            description: doc.description,
            url: `${env.NEXTAUTH_URL}/revision/docs/${params.id}`,
            images: [
                {
                    url: url,
                    width: 1200,
                    height: 600,
                    alt: doc.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@heurly",
            title: doc.title,
            description: doc.description,
            images: [url],
        },
    };
}
export default function Page({ params }: { params: { id: string } }) {
    return <ContentDocs docId={params.id} />;
}
