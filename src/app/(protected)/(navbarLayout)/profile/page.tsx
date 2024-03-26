import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getDocsByUser } from "@/server/docs";
import ID from "@/utils/id";
import { getURLsByUser } from "@/server/url-timetable";
import { Separator } from "@/components/ui/separator";
import ListUserFile from "@/components/profile/list-user-file";
import nameToInitials from "@/utils/nameToInitials";
import isAllowedTo from "@/components/utils/is-allowed-to";

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

    return (
        <div className="mt-16 grid h-full grid-cols-1 gap-5 md:mt-0 md:grid-cols-3 md:grid-rows-3">
            <Card className="p-7 md:col-span-1 md:row-span-1">
                <CardContent className="flex flex-col items-center justify-center gap-5">
                    <Avatar>
                        <AvatarImage
                            src={session.user.image ?? ""}
                            alt={name ?? "image de profil"}
                        />
                        <AvatarFallback>{nameToInitials(name)}</AvatarFallback>
                    </Avatar>
                    <h1>{session?.user.name}</h1>
                    <p>{session?.user.email}</p>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 md:col-start-2 md:row-span-1">
                <CardHeader>
                    <h2 className="text-xl font-bold">
                        Mes url d&apos;emplois du temps
                    </h2>
                </CardHeader>
                <CardContent>
                    {userUrl.length > 0 ? (
                        <>
                            <ul className="flex gap-5">
                                {userUrl.map(({ url }) => (
                                    <li
                                        key={ID()}
                                        className=" w-full cursor-pointer p-10"
                                    >
                                        <p>{url}</p>
                                    </li>
                                ))}
                            </ul>
                            <Separator />
                        </>
                    ) : (
                        <p>
                            Vous n&apos;avez pas encore d&apos;url
                            d&apos;emplois du temps.
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-xs">
                        Ces URL seront utilisé pour généré votre emplois du
                        temps disponible{" "}
                        <Link
                            href="/timetable"
                            className={buttonVariants({ variant: "link" })}
                        >
                            ici
                        </Link>
                    </p>
                </CardFooter>
            </Card>

            <Card className="md:col-span-3 md:row-span-2">
                <CardHeader>
                    <h2 className="text-xl font-bold">Mes documents</h2>
                </CardHeader>
                <CardContent>
                    {userDocs.length == 0 ? (
                        <p>Vous n&apos;avez pas encore de documents.</p>
                    ) : (
                        <div className="flex gap-5">
                            <ListUserFile
                                userId={session?.user.id}
                                userDocs={userDocs}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
