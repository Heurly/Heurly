"use client";

// components/FormCreateEvent.tsx
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formCreateEventSchema } from "@/types/schema/form-create-event";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@prisma/client";
import type { z } from "zod";
import { handleFormCreateEvent } from "@/server/event";
import { useState } from "react";
import { DatePicker } from "../ui/datepicker";

type FormCreateEventData = z.infer<typeof formCreateEventSchema>;

type PropsFormCreateEvent = {
    userId: User["id"];
};

export default function FormCreateEvent({ userId }: PropsFormCreateEvent) {
    const router = useRouter();
    const form = useForm<FormCreateEventData>({
        resolver: zodResolver(formCreateEventSchema),
    });
    const [isClicked, setIsClicked] = useState(false);

    const onSubmit = async (data: FormCreateEventData) => {
        const res = await handleFormCreateEvent({
            ...data,
            userId,
        });

        if (res.success === true) {
            form.reset({
                event: "",
                description: "",
                urlImage: "",
                location: "",
                eventDate: "",
            });
            isClicked && setIsClicked(false);
            router.push(`/event/${res.data.id}`);
        }
    };

    return (
        <>
            {!userId ? (
                <p>Vous devez être connecté pour créer un événement</p>
            ) : (
                <Form {...form}>
                    <form
                        className="flex flex-col items-end gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="event"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nom de événement</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Entrez le nom de l'événement"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Décrivez votre événement"
                                            className="h-40"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="urlImage"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Entrez l'url de l'image"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Lieu</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Entrez le lieu de l'événement"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="eventDate"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            onChange={() => {
                                                console.log("date changed");
                                            }}
                                            dateInput={new Date()}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Continuez avec les autres champs du formulaire de manière similaire */}
                        <Button type="submit" className="w-full md:w-auto">
                            Créer Événement
                        </Button>
                    </form>
                </Form>
            )}
        </>
    );
}
