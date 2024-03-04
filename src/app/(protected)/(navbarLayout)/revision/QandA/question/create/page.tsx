import FormCreateQuestion from "@/components/form/form-create-question";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoBackButton from "@/components/utils/go-back-button";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import router from "next/router";

export default async function CreateQuestionPage() {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    return (
        <Card className="mt-16 py-16 md:mt-0">
            <CardHeader>
                <GoBackButton />
            </CardHeader>
            <CardContent>
                <FormCreateQuestion userId={session?.user.id} />
            </CardContent>
        </Card>
    );
}
