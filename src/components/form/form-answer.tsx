"use client";

import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reply, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const maxCharsContent = 500;
const minCharsContent = 10;
const maxCharsTitle = 100;
const minCharsTitle = 5;

const formAnswerSchema = z.object({
    title: z
        .string({ required_error: "Le titre est requis" })
        .max(maxCharsTitle, {
            message: `Le titre ne doit pas dépasser ${maxCharsTitle} caractères`,
        })
        .min(minCharsTitle, {
            message: `Le titre doit contenir au moins ${minCharsTitle} caractères`,
        }),
    content: z
        .string({ required_error: "Le contenu est requis" })
        .max(maxCharsContent, {
            message: `Le contenu ne doit pas dépasser ${maxCharsContent} caractères`,
        })
        .min(minCharsContent, {
            message: `Le contenu doit contenir au moins ${minCharsContent} caractères`,
        }),
});

export default function FormAnswer() {
    const form = useForm<z.infer<typeof formAnswerSchema>>({
        resolver: zodResolver(formAnswerSchema),
    });

    const onSubmit = (data: z.infer<typeof formAnswerSchema>) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col items-end gap-5"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex w-full gap-x-3">
                    <Reply />
                    <FormField
                        control={form.control}
                        name="title"
                        render={() => (
                            <Input type="text" placeholder="Votre titre" />
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="content"
                    render={() => (
                        <Textarea
                            placeholder="Votre réponse"
                            className="h-40 rounded-b-3xl rounded-t-none "
                        />
                    )}
                />
                <Button type="submit" className="md:w-1/12">
                    <SendHorizontal />
                    &nbsp;Envoyer
                </Button>
            </form>
        </Form>
    );
}
