import FormUrlProfil from "@/components/form/form-url-profil";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProfilPage() {
    const session = await getServerAuthSession();

    // if the user is not authenticated, we redirect him to the login page
    if (session === null) redirect("/login");

    const userId = session.user.id;

    return (
        <Card className="w-11/12 py-5 md:px-10 md:py-16">
            <FormUrlProfil></FormUrlProfil>
        </Card>
    );
}
