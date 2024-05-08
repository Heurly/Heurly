"use client";

import { useEffect, useState } from "react";
import FormUrlTimetable from "./form/form-url-timetable";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

export default function AlertTimetable({ isNewUser }: { isNewUser: boolean }) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(isNewUser);
	}, [isNewUser]);

	return (
		<AlertDialog open={isOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Bonjour le nouveau late !
					</AlertDialogTitle>
					{/* <AlertDialogDescription> */}
					Plus qu&apos;une étape pour être un vrai late, tu dois
					renseigner ton URL de calendrier et c&apos;est parti !
					{/* </AlertDialogDescription> */}
				</AlertDialogHeader>
				<FormUrlTimetable />
			</AlertDialogContent>
		</AlertDialog>
	);
}
