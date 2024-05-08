"use client";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TLog, log } from "@/logger/logger";
import { DownloadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

declare global {
	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}
}

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

type TvariantPwaButton = "button" | "icon";

export default function InstallPwaButton({
	variant,
}: {
	variant: TvariantPwaButton;
}) {
	const [installable, setInstallable] = useState(false);

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (e) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can install the PWA
			setInstallable(true);
		});

		window.addEventListener("appinstalled", () => {
			// Log install to analytics
			log({ type: TLog.info, text: "PWA was installed" });
		});
	}, []);
	const handleInstallClick = async () => {
		// Hide the app provided install promotion
		setInstallable(false);

		// Show the install prompt
		if (deferredPrompt) {
			await deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
			try {
				const choiceResult = await deferredPrompt.userChoice;

				if (choiceResult.outcome === "accepted") {
					log({
						type: TLog.info,
						text: "User accepted the install prompt",
					});
				} else {
					log({
						type: TLog.info,
						text: "User dismissed the install prompt",
					});
				}
			} catch (error) {
				log({
					type: TLog.error,
					text: "Error occurred while handling install prompt",
				});
			}
		} else {
			log({ type: TLog.info, text: "Install prompt is not available" });
		}
	};
	if (!installable) return null;

	switch (variant) {
		case "button":
			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<Button onClick={handleInstallClick}>
								Installer Heurly
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Installer heurly</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		case "icon":
			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<DownloadCloud
								onClick={handleInstallClick}
								className="cursor-pointer"
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>Installer heurly</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
	}
}
