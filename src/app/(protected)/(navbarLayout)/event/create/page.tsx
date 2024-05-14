import FormCreateEvent from "@/components/event/form-create-event";
import FormCreateQuestion from "@/components/form/form-create-question";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoBackButton from "@/components/utils/go-back-button";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function CreateQuestionPage() {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    return (
        <Card className="mt-16 w-full md:mt-0">
            <CardHeader>
                <div className="flex items-center justify-center gap-x-5">
                    <GoBackButton />
                    <h1 className="w-full text-left text-xl font-bold">
                        Créer votre événement
                    </h1>
                </div>
            </CardHeader>
            <CardContent>
                <FormCreateEvent userId={session?.user.id} />
            </CardContent>
        </Card>
    );
}
