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
import { endOfWeek, startOfWeek } from "date-fns";
import FormUrlTimetable from "@/components/form/form-url-timetable";

export default async function PageTimetable() {
  const session = await getServerAuthSession();
  if (session === null) return null;

  const dateFilter = {
    greater: startOfWeek(new Date()).getTime(),
    lower: endOfWeek(new Date()).getTime(),
  };

  // we verify if the user have an url in the db
  // we count the number of url in the db for the user with prisma query
  const userUrlCount = await db.userTimetableURL.count({
    where: {
      userId: session?.user.id,
    },
  });

  // if the user has no url, we consider it as a new user
  const isNewUser = userUrlCount <= 0;

  return (
    <AlertDialog open={isNewUser}>
      <main className="h-full w-full">
        {isNewUser && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bonjour Heurlyte !</AlertDialogTitle>
              <div className="flex flex-col gap-y-5">
                <p>
                  Nous allons vous demander de choisir vos modules pour afficher
                  votre emploi du temps.
                </p>
                <FormUrlTimetable />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter></AlertDialogFooter>
          </AlertDialogContent>
        )}
        <Timetable />
      </main>
    </AlertDialog>
  );
}
