import FormUploadDocs from "@/components/form/form-upload-docs";
import { Card } from "@/components/ui/card";
import isAllowedTo from "@/components/utils/is-allowed-to";
import { getServerAuthSession } from "@/server/auth";

export default async function PageUpload() {
    const session = await getServerAuthSession();

    if (!session) return null;

    const userId = session.user.id;

    // verify if the user is allowed to see the page
    const isAllowed = await isAllowedTo("show_docs", userId);

    if (!isAllowed.result) return null;

    return (
        <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">
            <FormUploadDocs userId={userId} />
        </Card>
    );
}
