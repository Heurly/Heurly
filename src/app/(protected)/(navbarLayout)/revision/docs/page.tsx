import { Card } from "@/components/ui/card";

export default function PageDocsList() {
    const docs = [];
    return (
        <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">
            {docs.length == 0 && <p>Aucun document à afficher</p>}
        </Card>
    );
}
