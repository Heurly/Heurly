import Timetable from "@/components/timetable/timetable";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { getTimetableData } from "@/server/timetable";
import { TEventTimetable } from "@/types/timetable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { endOfWeek, startOfWeek } from "date-fns";

export default async function PageTimetable() {

  const session = await getServerAuthSession();

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
  let data: TEventTimetable[] | null = [];


  if (isNewUser) {
    data = await getTimetableData(dateFilter, modules);
  }

  return (
    <AlertDialog open={isNewUser}>
      <main className="w-full h-full">
        {
          isNewUser && (
            <>
              <AlertDialogContent >
                <AlertDialogHeader>
                  <AlertDialogTitle>Bonjour nouvel utilisateur !</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col gap-y-5">
                    Nous allons vous demander de choisir vos modules pour afficher votre emploi du temps.

                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>


                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                  <AlertDialogAction>Continuer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </>

          )
        }
        <Timetable tabEvents={data ?? []} />
      </main>
    </AlertDialog>
  );
}
