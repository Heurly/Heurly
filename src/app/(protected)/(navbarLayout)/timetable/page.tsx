import Timetable from "@/components/timetable/timetable";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormUrlTimetable from "@/components/form/form-url-timetable";
import { redirect } from "next/navigation";

export default async function PageTimetable() {
    const session = await getServerAuthSession();

    // if the user is not authenticated, we redirect him to the login page
    if (session === null) redirect("/login");

    const userId = session.user.id;

    // we verify if the user have an url in the db
    // we count the number of url in the db for the user with prisma query
    const userUrlCount = await db.userTimetableURL.count({
        where: {
            userId: userId,
        },
    });

    // if the user has no url, we consider it as a new user
    const isNewUser = userUrlCount <= 0;

    return (
        <AlertDialog open={true}>
            <main className="h-full w-full">
                {isNewUser && (
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Bonjour le nouveau late !
                            </AlertDialogTitle>
                            <p>
                                Plus qu&apos;une étape pour être un vrai late,
                                tu dois renseigner ton URL de calendrier et
                                c&apos;est parti !
                            </p>
                        </AlertDialogHeader>
                        <FormUrlTimetable />
                        <AlertDialogFooter></AlertDialogFooter>
                    </AlertDialogContent>
                )}
                <Timetable userId={userId} />
            </main>
        </AlertDialog>
    );
}
