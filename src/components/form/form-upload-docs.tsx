"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadFile } from "@/server/b2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fileFormDocsSchema } from "@/types/fileUpload";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

type FileFormValues = z.infer<typeof fileFormDocsSchema>;

export default function FormUploadDocs() {
    const form = useForm<FileFormValues>({
        resolver: zodResolver(fileFormDocsSchema),
    });

    const onSubmit = async (data: FileFormValues) => {
        const file = data.file as File;
        const res = await uploadFile(file);

        if (res?.error) {
            console.error(res.error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Votre meilleur fichier</FormLabel>
                                <Input
                                    type="file"
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={field.disabled}
                                    name={field.name}
                                    ref={field.ref}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
