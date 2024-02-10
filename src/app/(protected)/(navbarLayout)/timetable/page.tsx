import Timetable from "@/components/timetable/timetable";
import { getTimetableData } from "@/server/timetable";

export default async function PageTimetable() {
  
  const dateFilter = {
    start: 1634559600000,
    end: 1635164400000,
  }
  const modules = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const data = await getTimetableData(dateFilter, modules)
  return (
    <main className="w-full h-full">
      <Timetable data={data} />
    </main>
  );
}
