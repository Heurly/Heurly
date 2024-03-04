import FormCreateQuestion from "@/components/form/form-create-question";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function CreateQuestionPage() {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    return (
        <div>
            <FormCreateQuestion userId={session?.user.id} />
        </div>
    );
}
