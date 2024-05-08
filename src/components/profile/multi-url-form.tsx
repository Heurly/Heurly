"use client";
import { TLog, log } from "@/logger/logger";
import { addProfileUnitByUrl, deleteProfileUnitUrl } from "@/server/user";
import { type TCustomURL, schemaUrl } from "@/types/schema/url";
import ID from "@/utils/id";
import { Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import InputCopy from "../ui/input-copy";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

type MultipleUrlFormProps = {
	initialUrls: string[];
};
export default function MultipleUrlForm({ initialUrls }: MultipleUrlFormProps) {
	const [urls, setUrls] = useState<TCustomURL[]>(initialUrls);
	const refInputUrl = useRef<HTMLInputElement>(null);
	const session = useSession();

	if (!session.data)
		return <p>Vous devez être connecté pour accéder à ce forumulaire</p>;

	const handleDeleteURL = async (url: TCustomURL, index: number) => {
		// Check if the URL is valid
		const checkUrl = schemaUrl.safeParse(url);
		if (!checkUrl.success) throw new Error("invalid URL");
		try {
			const isDelete = await deleteProfileUnitUrl(session.data.user.id, url);
			if (!isDelete) throw new Error("Error while deleting the URL");
			const newUrls = urls.filter((_, i) => i !== index);
			setUrls(newUrls);
		} catch (e) {
			if (e instanceof Error) log({ type: TLog.error, text: `${e.message}` });
		}
	};

	const handleAddURL = async (event: FormEvent<HTMLFormElement>) => {
		// Prevent the form from submitting
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		const urlToAdd = formData.get("url");

		// Check if the URL is valid
		const checkUrl = schemaUrl.safeParse(urlToAdd);
		if (!checkUrl.success) throw new Error("invalid URL");
		const safeUrlToAdd = urlToAdd as TCustomURL;

		try {
			// Add the URL to the database
			const isAdd = await addProfileUnitByUrl(
				session.data.user.id,
				safeUrlToAdd,
			);
			if (!isAdd) throw new Error("Error while adding the URL");
			setUrls([...urls, safeUrlToAdd]);
		} catch (e) {
			if (e instanceof Error) log({ type: TLog.error, text: `${e.message}` });
		}
	};

	return (
		<div className="flex flex-col gap-y-5">
			<div className="flex h-28 flex-col gap-y-2 overflow-auto">
				{urls.map((url: string, index) => (
					<div className="flex gap-x-4" key={ID()}>
						<InputCopy type="text" placeholder="votre URL" value={url} />
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size={"icon"}
										className="!rounded-md"
										onClick={() => handleDeleteURL(url, index)}
									>
										<Trash2 />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Supprimer</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				))}
			</div>
			<form className="flex gap-x-5" onSubmit={handleAddURL}>
				<Input
					type="text"
					placeholder="Une nouvelle URL ?"
					name="url"
					ref={refInputUrl}
				/>
				<Button className="!rounded-md">
					Ajouter
					<Plus className="ml-3 size-5" />
				</Button>
			</form>
		</div>
	);
}
