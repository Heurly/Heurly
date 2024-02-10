import Timetable from "@/components/timetable/timetable";
import { getTimetableData } from "@/server/timetable";

export default async function PageTimetable() {

  // Assuming you want the dates for the current year
  const year = new Date().getFullYear();

  // Start of March 18th
  const startMarch18 = new Date(year, 2, 18); // Month is 0-indexed (0 is January, so 2 is March)

  // End of March 24th (start of March 25th minus one millisecond)
  const endMarch24 = new Date(year, 2, 25);
  
  const dateFilter = {
    greater: startMarch18.getTime(),
    lower: endMarch24.getTime(),
  };

  const modules = [3033];

  const data = await getTimetableData(dateFilter, modules);
 
  console.log(data)

  return (
    <main className="w-full h-full">
      <Timetable tabEvents={data} />
    </main>
  );
}
