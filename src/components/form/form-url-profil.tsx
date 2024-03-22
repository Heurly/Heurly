"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { getCurrentProfileUnitUrl, updateProfileUnitUrl } from "@/server/user";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const urlFormSchema = z.object({
    url: z.string().url({ message: "L'URL est invalide" }),
});

type UrlFormValues = z.infer<typeof urlFormSchema>;

type PropsFormUrlProfile = {
    className?: string;
};

export default function FormUrlProfil({ className }: PropsFormUrlProfile) {
    const session = useSession();
    const form = useForm<UrlFormValues>({
        resolver: zodResolver(urlFormSchema),
    });
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (session.data) {
            const fetchUrl = async () => {
                try {
                    const fetchedUrl = await getCurrentProfileUnitUrl(
                        session.data.user.id,
                    );
                    setCurrentUrl(fetchedUrl ?? "Pas d'URL");
                } catch (error) {
                    console.error(
                        "Erreur lors de la récupération de l'URL du profil :",
                        error,
                    );
                }
            };
            void fetchUrl();
        }
    }, [session.data]);

    const onSubmit = async (data: UrlFormValues) => {
        if (session.data) {
            console.log("Tentative de mise à jour de l'URL avec :", data.url); // Log avant la mise à jour
            try {
                await updateProfileUnitUrl(session.data.user.id, data.url);
                const fetchedUrl = await getCurrentProfileUnitUrl(
                    session.data.user.id,
                );
                setCurrentUrl(fetchedUrl ?? "Pas d'URL");
                // Clear the form field
                form.reset({ url: "" }); // Resets the url field to an empty string
                router.refresh();
            } catch (error) {
                console.error(
                    "Erreur lors de l'ajout de l'URL du profil :",
                    error,
                );
            }
        }
    };

    if (!session.data) return <p>Veuillez vous connecter pour continuer.</p>;

    return (
        <>
            <div className="mb-5 flex">
                <span className=""></span>
                <span>Votre URL actualle : {currentUrl ?? "Pas d'URL"}</span>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(className, "space-y-5")}
                >
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Changer votre URL</FormLabel>
                                <Input {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={!form.formState.isValid}>
                        Envoyer l&apos;URL
                    </Button>
                </form>
            </Form>
        </>
    );
}
