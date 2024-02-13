import Timetable from "@/components/timetable/timetable";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { getTimetableData } from "@/server/timetable";
import { TEventTimetable } from "@/types/timetable";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";
import { endOfWeek, startOfWeek } from "date-fns";
import FormUnits from "@/components/form/form-units";
import { IcalObject } from "ical2json";
import FormUrlTimetable from "@/components/form/form-url-timetable";
import { SessionProvider } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export default async function PageTimetable() {

  const session = await getServerAuthSession();
  if (session === null) return null;

  const dateFilter = {
    greater: startOfWeek(new Date()).getTime(),
    lower: endOfWeek(new Date()).getTime(),
  };

  const userUnits = await db.userUnit.findMany({
    where: {
      user: {
        id: session?.user.id
      }
    }
  })
  const modules = userUnits.map((unit) => unit.unitId)
  const isNewUser = modules.length === 0;
  // get modules from user
  // const modules = [530, 3258, 3261, 3333];
  let data: TEventTimetable[] | IcalObject | null = [];


  if (!isNewUser) {
    data = await getTimetableData(dateFilter, modules, session?.user.id);
  }

  return (

    <main className="w-full h-full">

      <AlertDialog open={isNewUser}>
        {
          isNewUser && (
            <AlertDialogContent >
              <AlertDialogHeader>
                <AlertDialogTitle>Bonjour Heurlyte !</AlertDialogTitle>
                <AlertDialogDescription className="flex flex-col gap-y-5">
                  Nous allons vous demander de choisir vos modules pour afficher votre emploi du temps.
                  <FormUnits session={session} />
                  <Separator />
                  <FormUrlTimetable />
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                {/* <AlertDialogAction>Continuer</AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          )
        }
        <Timetable />
      </AlertDialog>
    </main>
  );
}


