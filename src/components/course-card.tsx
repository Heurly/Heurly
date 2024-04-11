import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Folder } from "lucide-react";


interface props {
    name: string
}

export function CourseCard({ data }: { data: props }) {

    return (
        <Card className="flex mx-2 my-2 bg-secondary !rounded-xl ">
            <div className="flex gap-4 px-4 py-2 wrap align items-center">
                <Folder size={32} />
                <p className="w-48 text-ellipsis overflow-hidden text-nowrap">{data.name}</p>
            </div>
        </Card>
    );
}

{ }
