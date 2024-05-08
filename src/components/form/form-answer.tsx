"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { handleFormCreateAnswer } from "@/server/answer";
import { formAnswerSchema } from "@/types/schema/form-answer";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Question, User } from "@prisma/client";
import cn from "classnames";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
            isClicked && setIsClicked(false);
            router.refresh();
        }
    };

    const [isClicked, setIsClicked] = useState(false);

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
                                                className={cn(
                                                    "rounded-none border-b transition",
                                                    isClicked
                                                        ? "h-40"
                                                        : "h-2 min-h-[2.5rem] border-x-0 border-t-0",
                                                )}
                                                {...field}
                                                onClick={() =>
                                                    setIsClicked(true)
                                                }
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
