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
// import {  handleFormUploadDocs } from "@/server/docs";
import { formUploadDocsSchema } from "@/types/schema/fileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FormUploadDocs() {
    const session = useSession();
    const form = useForm<z.infer<typeof formUploadDocsSchema>>({
        resolver: zodResolver(formUploadDocsSchema),
    });

    const [wasUploaded, setWasUploaded] = useState(false);

    const fileRef = form.register("file");

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
            }
        }

        // if(!session.data) return;

        const userId = session.data!.user.id;

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
            {!session.data?.user?.id ? (
                <p>
                    Vous devez être connecté pour pouvoir uploader un document
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full p-10"
                    >
                        <FormField
                            control={form.control}
                            name="file"
                            render={() => {
                                return (
                                    <FormItem>
                                        <FormLabel>File</FormLabel>
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
