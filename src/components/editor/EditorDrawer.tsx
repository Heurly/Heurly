"use client";
import { getCourse } from "@/server/courses";
import type { CourseDate } from "@/types/courses";
import type { Course, Notes } from "@prisma/client";
import { CalendarSearch } from "lucide-react";
import { useSession } from "next-auth/react";
import type React from "react";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import EventSelect from "../courses/EventSelect";
import NotesVisibility from "../docs/NotesVisibility";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Switch } from "../ui/switch";

interface Props {
	notes: Notes;
	setNotes: (notes: Notes) => void;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const EditorDrawer: React.FunctionComponent<Props> = ({
	notes,
	setNotes,
	open,
	setOpen,
}) => {
	const session = useSession();
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [course, setCourse] = useState<Course | undefined>(undefined);

	const applyCourse = useCallback(
		async (courseDate: CourseDate) => {
			if (
				courseDate?.courseId === undefined ||
				courseDate.courseDate === undefined
			)
				return;
			setNotes({
				...notes,
				courseId: courseDate.courseId,
				courseDate: courseDate.courseDate,
			});
		},
		[notes, setNotes],
	);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => {
			window.removeEventListener("resize", checkScreenSize);
		};
	}, []);

	useEffect(() => {
		const getCourseData = async () => {
			if (!notes.courseId) return;

			const r = await getCourse(notes.courseId);
			if (!r) return;
			if (r !== undefined) setCourse(r);
		};

		void getCourseData();
	}, [notes]);

	return (
		<div onClick={() => setOpen(false)}>
			{session?.data?.user?.id !== undefined && (
				<Drawer
					open={open}
					onClose={() => setOpen(false)}
					direction={isMobile ? "bottom" : "right"}
				>
					<DrawerContent
						onEscapeKeyDown={() => setOpen(false)}
						onClick={(e) => e.stopPropagation()}
						className="left-[unset] right-0 flex h-2/3 w-full flex-col p-6 md:h-full md:w-[500px]"
					>
						<DrawerTitle className="p-6">
							<p className="text-3xl font-bold">Gestion de notes</p>
							<p className="text-xl">Titre : {notes.title}</p>
						</DrawerTitle>
						<div className="mt-6 flex size-full flex-col gap-4">
							<h3 className="text-xl font-bold">Visibilité</h3>
							<div className="flex items-center gap-4 rounded-xl border p-6 align-middle">
								<NotesVisibility isPublic={notes.public} />
								<Switch
									disabled={session.data?.user.id !== notes.userId}
									onCheckedChange={async (v) => {
										setNotes({
											...notes,
											public: !v,
										});
									}}
									checked={!notes.public}
								/>
							</div>
							<Collapsible className="flex flex-col gap-2">
								<h3 className="text-xl font-bold">Cours associé</h3>
								<div className=" rounded-xl border p-6">
									<CollapsibleTrigger className="flex w-fit items-center justify-between gap-4 rounded-xl border bg-sky-200 p-1 px-4 text-sm text-slate-600 hover:bg-sky-200/50">
										<CalendarSearch />
										{course !== undefined ? (
											<div>
												<p>
													{course?.name ??
														course?.small_code ??
														course?.small_code ??
														""}
												</p>
												<p>{notes.courseDate?.toLocaleString() ?? ""}</p>
											</div>
										) : (
											<p>Associer un cours</p>
										)}
									</CollapsibleTrigger>
									<CollapsibleContent>
										<EventSelect
											className="h-[350px] rounded-xl bg-white p-4"
											setValue={applyCourse}
											userId={session.data?.user.id}
										/>
									</CollapsibleContent>
								</div>
							</Collapsible>
						</div>
						<Button
							onClick={() => setOpen(false)}
							className="mt-auto w-full"
							variant="outline"
						>
							Fermer
						</Button>
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
};

export default EditorDrawer;
