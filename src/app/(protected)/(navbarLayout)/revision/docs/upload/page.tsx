"use client";
import FormUploadDocs from "@/components/form/form-upload-docs";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function PageUpload() {
    return (
        <SessionProvider>
            <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">
                <FormUploadDocs />
            </Card>
        </SessionProvider>
    );
}
