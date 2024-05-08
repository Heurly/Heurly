import type React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

interface Props {
	children?: React.ReactNode;
	buttonText?: string;
	onConfirm: () => void;
	title?: string;
	text: string;
}

const ConfirmationDialog: React.FunctionComponent<Props> = ({
	children,
	buttonText,
	onConfirm,
	title,
	text,
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{children !== undefined ? (
					children
				) : (
					<Button>{buttonText}</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					{title !== undefined && (
						<AlertDialogTitle>{title}</AlertDialogTitle>
					)}
					<AlertDialogDescription>{text}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						Continuer
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConfirmationDialog;
