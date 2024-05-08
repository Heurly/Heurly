import AlertTimetable from "@/components/alert-timetable";
import Timetable from "@/components/timetable/timetable";
import isAllowedTo from "@/components/utils/is-allowed-to";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export default async function PageTimetable() {
	const session = await getServerAuthSession();

	// if the user is not authenticated, we redirect him to the login page
	if (session === null) redirect("/login");

	const userId = session.user.id;

	const isAllowed = await isAllowedTo("show_timetable", userId);

	if (!isAllowed.result) return null;

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
		<main className="h-full w-full">
			<AlertTimetable isNewUser={isNewUser} />
			<Timetable userId={userId} />
		</main>
	);
}
