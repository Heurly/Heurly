"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDocs } from "@/server/docs";
import { Docs } from "@prisma/client";
import { Folder } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface props {
    name: string;
    newurl: string

}
const plugIns = [
    {
        name: "Flashcards",
        href: "/flashcards",
    },
    {
        name: "Flashcards 2",
        href: "/flashcards",
    },
];



export function CourseCard({ data }: { data: props }) {
    const [show_div, setshow_div] = useState(false);
    let t = 0

    const [docs, setDocs] = useState<Docs[]>([]);

    const onClick = () => {
        console.log("Youhou");
        setshow_div(true);
    }

    useEffect(() => {

        const fetchDocs = async () => {
            const resFetchDocs = await getDocs();
            console.log(resFetchDocs);

            setDocs(resFetchDocs);
         
        }
      
        void fetchDocs()
    }, [])
    
    console.log(t, docs)
    return (
        <Link href={`?type=${data.name}`}>
            <div className="flex flex-wrap gap-5">
                {docs?.map(({ title, url }) => (

                    <Card className="flex mx-2 my-2 bg-secondary !rounded-xl">
                        <div className="flex gap-4 px-4 py-2 wrap align items-center">
                            <Folder size={32} />
                            <p className="w-48 text-ellipsis overflow-hidden text-nowrap">{title}</p>
                        </div>
                    </Card>

                ))}
                {!plugIns && <p>Aucun plug-in trouvé</p>}
            </div>
            {/* </Card> */}
        </Link>
    );
}

{ }
