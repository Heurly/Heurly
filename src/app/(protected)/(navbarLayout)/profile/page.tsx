import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { deleteUserDoc, getDocsByUser } from "@/server/docs";
import ID from "@/utils/id";
import { FileText, Trash } from "lucide-react";
import { getURLsByUser } from "@/server/url-timetable";
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: "Mon profil",
    description: "Vos informations personnelles et vos documents",

}

export default async function PageUserProfile() {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    const [userDocs, userUrl] = await Promise.all([
        getDocsByUser(session?.user.id),
        getURLsByUser(session?.user.id)
    ]);

    const name = session?.user.name;

    if (!name) return null;
    const initials = name.split(" ").map((n) => n[0]).join("");

    return (
        <div className="grid md:grid-cols-3 md:grid-rows-3 gap-5 grid-cols-1 h-full mt-16 md:mt-0">
            <Card className="md:col-span-1 md:row-span-1 p-7">
                <CardContent className="flex flex-col items-center justify-center gap-5">
                    <Avatar>
                        <AvatarImage
                            src={session.user.image ?? ""}
                            alt={name ?? "image de profil"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <h1>{session?.user.name}</h1>
                    <p>{session?.user.email}</p>
                </CardContent>
            </Card>

            <Card className="md:col-start-2 md:col-span-2 md:row-span-1">
                <CardHeader>
                    <h2 className="text-xl font-bold">Mes url d&apos;emplois du temps</h2>
                </CardHeader>
                <CardContent>
                    {
                        userUrl.length > 0 ? (
                            <>
                                <ul className="flex gap-5">
                                    {userUrl.map(({ url }) => (
                                        <li key={ID()} className=" w-full p-10 cursor-pointer">
                                            <p>{url}</p>
                                        </li>
                                    ))}
                                </ul>
                                <Separator />
                            </>
                        ) : (
                            <p>Vous n&apos;avez pas encore d&apos;url d&apos;emplois du temps.</p>
                        )

                    }
                </CardContent>
                <CardFooter>
                    <p className="text-xs">Ces URL seront utilisé pour généré votre emplois du temps disponible <Link href="/timetable" className={buttonVariants({ variant: "link" })}>ici</Link></p>
                </CardFooter>
            </Card>


            <Card className="md:col-span-3 md:row-span-2">
                <CardHeader>
                    <h2 className="text-xl font-bold">Mes documents</h2>
                </CardHeader>
                <CardContent>
                    {
                        userDocs.length == 0
                            ? (
                                <p>Vous n&apos;avez pas encore de documents.</p>)
                            : (
                                <div className="flex gap-5">
                                    {userDocs.map(({ id, title }) => (
                                        <Link href={`/QandA/docs/${id}`} key={ID()}>
                                            <Card key={ID()} className="p-10 cursor-pointer relative">
                                                <div className="rounded-full h-10 w-10 border hover:bg-red-300 transition bg-white absolute top-0 right-0 flex items-center justify-center translate-x-1/2 -translate-y-1/2"
                                                onClick={async ()=>{await deleteUserDoc(id, session.user.id)}}>
                                                    <Trash />
                                                </div>
                                                <FileText />
                                                {title}
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                            )
                    }
                </CardContent>
            </Card>


        </div>
    )

}