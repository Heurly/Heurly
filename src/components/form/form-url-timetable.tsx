"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { addProfileUnitByUrl } from "@/server/user";
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

const urlFormSchema = z.object({
    url: z.string().url({ message: "L'URL est invalide" }),
});

type UrlFormValues = z.infer<typeof urlFormSchema>;

type PropsFormUrlTimetable = {
    className?: string;
};

export default function FormUrlTimetable({ className }: PropsFormUrlTimetable) {
    const session = useSession();
    const form = useForm<UrlFormValues>({
        resolver: zodResolver(urlFormSchema),
    });

    const router = useRouter();

    const onSubmit = async (data: UrlFormValues) => {
        if (session.data) {
            try {
                await addProfileUnitByUrl(session.data.user.id, data.url);
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
                            <FormLabel>Votre belle URL</FormLabel>
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
    );
}
