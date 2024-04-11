import { DataTable } from "@/components/data-table";
import { rightColumns } from "@/components/right-table/right-column";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoBackButton from "@/components/utils/go-back-button";
import { getUsersWithRole } from "@/server/user";

export default async function AdminRightPage() {
    const users = await getUsersWithRole();
    if (!users) {
        return null;
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-start gap-x-5">
                    <GoBackButton /> <h1>Admin - Page des droits</h1>
                </div>
            </CardHeader>

            <CardContent>
                <DataTable data={users} columns={rightColumns} />
            </CardContent>
        </Card>
    );
}
