import isAllowedTo from "@/components/utils/is-allowed-to";
import { getServerAuthSession } from "@/server/auth";

export default async function LayoutAdmin({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerAuthSession();
    if (!session) {
        return null;
    }

    const isAllowedToSeeAdmin = await isAllowedTo(
        "show_admin",
        session.user.id,
    );

    if (!isAllowedToSeeAdmin.result) {
        return null;
    }

    return <>{children}</>;
}
