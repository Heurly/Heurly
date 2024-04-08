import { Card, CardContent, CardHeader } from "@/components/ui/card";


interface props {
    name: string
}

export function CourseCard( {data} : {data : props}) {

    return (
        <>
            <CardContent className="flex h-full w-full items-center justify-center gap-5 border rounded-md mx-2 my-2">
                <h1>Course : {data.name}</h1>
            </CardContent>
        </>
    );
}

{ }
