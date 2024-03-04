"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { formCreateQuestionSchema } from "@/types/schema/form-create-question";
import { handleFormCreateQuestion } from "@/server/question";

type PropsFormCreateQuestion = {
    userId: User["id"];
};

export default function FormCreateQuestion({
    userId,
}: PropsFormCreateQuestion) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formCreateQuestionSchema>>({
        resolver: zodResolver(formCreateQuestionSchema),
    });

    const onSubmit = async (data: z.infer<typeof formCreateQuestionSchema>) => {
        const resCreateQuestion = await handleFormCreateQuestion({
            ...data,
            userId,
        });

        if (resCreateQuestion.success === true) {
            form.reset({
                question: "",
                description: "",
            });
            router.push(
                `/revision/QandA/question/${resCreateQuestion.data.id}`,
            );
        }
    };

    return (
        <>
            {!userId ? (
                <p>Vous devez être connecté pour créer une question</p>
            ) : (
                <Form {...form}>
                    <form
                        className="flex flex-col items-end gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="flex w-full gap-x-3">
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Question</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Comment fait-on pour...?"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Salut ! ..."
                                            className="h-40 rounded-t-none "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
