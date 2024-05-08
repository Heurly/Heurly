"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import GoBackButton from "@/components/utils/go-back-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FeatureCreatePage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const name = searchParams.get("name");

	const [nameValue, setNameValue] = useState<string>(name ? name : "");

	const { toast } = useToast();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		console.log("submit");
		toast({
			title: "Demande non prise en compte",
			description:
				"La demande de création de feature n'a pas été prise en compte, veuillez réessayer plus tard.",
		});
	};
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-start gap-x-5">
					<GoBackButton /> <h1>Création de Feature</h1>
				</div>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col items-start gap-3"
				>
					<Label>Nom de la feature</Label>
					<Input
						type="text"
						placeholder="la nouvelle feature trop cool"
						value={nameValue}
						onChange={(e) => {
							const value = e.target.value;
							setNameValue(value);
							const params = new URLSearchParams(searchParams.toString());
							params.set("name", value);
							router.push(`${pathname}?${params.toString()}`);
						}}
					/>
					<Label>Liens de la page de la feature</Label>
					<Input type="text" placeholder="https://heurly.fr/nouvelle/feature" />
					<Button type="submit" className="self-end">
						Demander
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
