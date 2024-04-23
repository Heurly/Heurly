"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDocs } from "@/server/docs";
import { Folder } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface props {
    name: string;

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
    const onClick = () => {
        console.log("Youhou");
        setshow_div(true);
    }

    useEffect(()=>{
        
        const fetchDocs = async () =>{
            const resFetchDocs = await getDocs();
            console.log(resFetchDocs)
        }

        void fetchDocs()
    },[])

    return (
        <Link href={`?type=${data.name}`}>
        <Card onClick={onClick} className="flex mx-2 my-2 bg-secondary !rounded-xl ">
            {!show_div && <div className="flex gap-4 px-4 py-2 wrap align items-center">
                <Folder size={32} />
                <p className="w-48 text-ellipsis overflow-hidden text-nowrap">{data.name}</p>
            </div>}
            {show_div &&<div className="flex flex-wrap gap-5">
                {plugIns?.map(({ name, href }) => (

                    <Card className="flex h-36 w-36 cursor-pointer flex-col items-center justify-center">
                        <div>
                            <p>{name}</p>
                        </div>
                    </Card>

                ))}
                {!plugIns && <p>Aucun plug-in trouvé</p>}
            </div>}
        </Card>
        </Link>
    );
}

{ }
