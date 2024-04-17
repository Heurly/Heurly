"use client";

import FormUrlTimetable from "./form/form-url-timetable";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";

export default function AlertTimetable({ isNewUser }: { isNewUser: boolean }) {
    return (
        <AlertDialog open={isNewUser}>
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
