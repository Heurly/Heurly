"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reply, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formAnswerSchema } from "@/types/schema/form-answer";
import type { Question, User } from "@prisma/client";
import { handleFormCreateAnswer } from "@/server/answer";
import { useRouter } from "next/navigation";

type PropsFormAnswer = {
    userId: User["id"];
    questionId: Question["id"];
};

export default function FormAnswer({ userId, questionId }: PropsFormAnswer) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formAnswerSchema>>({
        resolver: zodResolver(formAnswerSchema),
    });

    const onSubmit = async (data: z.infer<typeof formAnswerSchema>) => {
        const res = await handleFormCreateAnswer({
            ...data,
            userId,
            questionId,
        });

        if (res.success === true) {
            form.reset({
                content: "",
            });
            router.refresh();
        }
    };

    return (
        <>
            {!userId ? (
                <p>Vous devez être connecté pour répondre à une question</p>
            ) : (
                <Form {...form}>
                    <form
                        className="flex flex-col items-end gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="flex w-full gap-x-3">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Textarea
                                                placeholder="Votre réponse"
                                                className="h-40 rounded-t-none "
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full md:w-40">
                            <SendHorizontal />
                            &nbsp;Envoyer
                        </Button>
                    </form>
                </Form>
            )}
        </>
    );
}
