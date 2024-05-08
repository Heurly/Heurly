"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import {  handleFormUploadDocs } from "@/server/docs";
import { formUploadDocsSchema } from "@/types/schema/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function FormUploadDocs({ userId }: { userId: User["id"] }) {
    const form = useForm<z.infer<typeof formUploadDocsSchema>>({
        resolver: zodResolver(formUploadDocsSchema),
    });

    const [wasUploaded, setWasUploaded] = useState(false);

    const fileRef = form.register("file");
    const descriptionRef = form.register("description");
    const titleRef = form.register("title");

    const onSubmit = async (data: z.infer<typeof formUploadDocsSchema>) => {
        // Verification for file size and type with zod
        const res = formUploadDocsSchema.safeParse(data);

        const files = data.file as FileList;

        if (!res.success) {
            form.setError("file", {
                message: res.error.errors[0]?.message,
            });
            return;
        }
        const sendForm = new FormData();
        if (!files) return;

        for (const file of files) {
            // Correctly check if the file at the current index is not undefined
            if (file) {
                sendForm.append("file", file);
                sendForm.append("title", data.title);
                sendForm.append("description", data.description);
            }
        }

        sendForm.append("userId", userId);

        type error = { error: string };
        type success = { success: boolean };
        type returnUpload = error | success;

        const resUpload = await fetch("/api/docs", {
            method: "POST",
            body: sendForm,
        });

        const dataUpload = (await resUpload.json()) as returnUpload;

        if (!dataUpload) return;

        if ("error" in dataUpload && dataUpload.error) {
            form.setError("file", {
                message: dataUpload.error,
            });
            return;
        }

        if ("success" in dataUpload && dataUpload.success) setWasUploaded(true);
    };

    return (
        <>
            {!userId ? (
                <p>
                    Vous devez être connecté pour pouvoir uploader un document
                </p>
            ) : (
                <Form {...form}>
                    <h2 className="text-2xl font-bold md:text-3xl">
                        Upload un document
                    </h2>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="md:w-1/1 flex w-full flex-col gap-4 lg:w-1/2 xl:w-1/3"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={() => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-xl font-bold">
                                            Titre
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="text" {...titleRef} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={() => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-xl font-bold">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tape ta description ici"
                                                {...descriptionRef}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={() => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-xl font-bold">
                                            Télécharger un document
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="file" {...fileRef} />
                                        </FormControl>
                                        <FormMessage />
                                        {wasUploaded && (
                                            <FormMessage>
                                                File was uploaded
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                );
                            }}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </>
    );
}
