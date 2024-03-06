"use client";
import { Alert } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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

export default function AlertInstallPWA() {
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
            console.log("INSTALL: Success");
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
                    console.log("User accepted the install prompt");
                } else {
                    console.log("User dismissed the install prompt");
                }
            } catch (error) {
                console.log(
                    "Error occurred while handling install prompt:",
                    error,
                );
            }
        } else {
            console.log("Install prompt is not available");
        }
    };
    return (
        <>
            {installable && (
                <Alert className="hidden h-[2svh] md:block md:rounded-none">
                    Pour une meilleur expérience, installez la PWA heurly{" "}
                    <Button onClick={handleInstallClick}>Installer</Button>
                </Alert>
            )}
        </>
    );
}
