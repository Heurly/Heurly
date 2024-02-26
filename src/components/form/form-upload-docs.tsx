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
import { uploadFile } from "@/server/b2";
import { fileFormDocsSchema } from "@/types/fileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FormUploadDocs() {
    const form = useForm<z.infer<typeof fileFormDocsSchema>>({
        resolver: zodResolver(fileFormDocsSchema),
    });

    const [wasUploaded, setWasUploaded] = useState(false);

    const fileRef = form.register("file");

    const onSubmit = async (data: z.infer<typeof fileFormDocsSchema>) => {
        console.log(data);
        // Verification for file size and type with zod
        const res = fileFormDocsSchema.safeParse(data);

        const files = data.file as FileList;

        if (!res.success) {
            form.setError("file", {
                message: res.error.errors[0]?.message,
            });
            return;
        }

        // Read the file as a Blob
        // transform the FilesList into an array
        const tabFiles = Array.from(files);

        for (const file of tabFiles) {
            console.log(file);
            const resUpload = await uploadFile(file);
            if (resUpload?.error) {
                form.setError("file", {
                    message: resUpload.error,
                });
                return;
            }
        }

        setWasUploaded(true);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full p-10"
            >
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>File</FormLabel>
                                <FormControl>
                                    <Input type="file" {...fileRef} />
                                </FormControl>
                                <FormMessage />
                                {wasUploaded && (
                                    <FormMessage>File was uploaded</FormMessage>
                                )}
                            </FormItem>
                        );
                    }}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
