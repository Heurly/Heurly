import { DataTable } from "@/components/data-table";
import { rightColumns } from "@/components/right-table/right-column";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { getRoles } from "@/server/role";
import { getUsersWithRole } from "@/server/user";

export default async function AdminRightPage() {
    const users = await getUsersWithRole();
    // const roles = await getRoles();
    if (!users) {
        return null;
    }
    return (
        <Card>
            <CardHeader>
                <h1>Admin - Page des droits</h1>
            </CardHeader>

            <CardContent>
                <DataTable data={users} columns={rightColumns} />
            </CardContent>
        </Card>
    );
}
