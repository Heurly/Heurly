import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function PageDocs({
    params: { id },
}: {
    params: { id: string };
}) {
    if (!id) redirect("/404");

    return (
        <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10"></Card>
    );
}
