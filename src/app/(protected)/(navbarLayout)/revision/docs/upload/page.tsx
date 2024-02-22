import { FormUploadDocs } from "@/components/form/form-upload-docs";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function PageUpload() {


  return (
    <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">     
      <FormUploadDocs />
    </Card>
  );
}
