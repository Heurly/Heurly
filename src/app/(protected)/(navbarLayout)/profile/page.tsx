import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDocsByUser } from "@/server/docs";
import { getURLsByUser } from "@/server/url-timetable";
import nameToInitials from "@/utils/nameToInitials";
import MultipleUrlForm from "@/components/profile/multi-url-form";
import isAllowedTo from "@/components/utils/is-allowed-to";
import NotesTable from "@/components/profile/NotesTable";
import { getAllUserNotes } from "@/server/notes";
import DocsTable from "@/components/profile/DocsTable";

export const metadata = {
    title: "Mon profil",
    description: "Vos informations personnelles et vos documents",
};

export default async function PageUserProfile() {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    // verify if the user is allowed to see the page
    const isAllowed = await isAllowedTo("show_profile", session.user.id);
    if (!isAllowed.result) return null;

    const [userDocs, userUrl] = await Promise.all([
        getDocsByUser(session?.user.id),
        getURLsByUser(session?.user.id),
    ]);

    const name = session?.user.name;

    if (!name) return null;

    const notes = await getAllUserNotes(session.user.id);

    return (
        <div className="flex grid-cols-1 flex-col gap-5 pb-24 md:grid md:h-full md:grid-cols-3 md:grid-rows-3 md:pb-0">
            <Card className="p-6 md:col-span-1 md:row-span-1">
                <CardContent className="flex h-full w-full flex-col items-center justify-center gap-5 md:flex-row">
                    <Avatar className="size-11 md:size-16">
                        <AvatarImage
                            src={session.user.image ?? ""}
                            alt={name ?? "image de profil"}
                        />
                        <AvatarFallback>{nameToInitials(name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-center md:items-start">
                        <h1 className="font-bold">{session?.user.name}</h1>
                        <p>{session?.user.email}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-y-auto md:col-span-2 md:col-start-2 md:row-span-1">
                <CardHeader>
                    <h2 className="text-xl font-bold">
                        Mes url d&apos;emplois du temps
                    </h2>
                </CardHeader>
                <CardContent>
                    {userUrl.length > 0 ? (
                        <>
                            <MultipleUrlForm
                                initialUrls={userUrl.map((item) => item.url)}
                            ></MultipleUrlForm>
                        </>
                    ) : (
                        <p>
                            Vous n&apos;avez pas encore d&apos;url
                            d&apos;emplois du temps.
                        </p>
                    )}
                    {/* <Separator /> */}
                </CardContent>
            </Card>

            <Card className="col-span-1 row-span-2">
                <CardHeader className="text-xl font-bold">
                    Mon Activité
                </CardHeader>
                <CardContent className="w-full">
                    Aucune activité récente.
                </CardContent>
            </Card>
            <Card className="col-span-1 row-span-2">
                <CardHeader className="text-xl font-bold">
                    Mes Documents
                </CardHeader>
                <CardContent className="w-full">
                    <DocsTable data={userDocs ?? []} />
                </CardContent>
            </Card>
            <Card className="col-span-1 row-span-2">
                <CardHeader className="text-xl font-bold">Mes Notes</CardHeader>
                <CardContent className="w-full">
                    <NotesTable data={notes ?? []} />
                </CardContent>
            </Card>
        </div>
    );
}
