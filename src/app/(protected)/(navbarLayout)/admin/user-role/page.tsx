import { DataTable } from "@/components/data-table";
import {
    rightColumns,
    TUserTable,
} from "@/components/right-table/right-column";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { getRoles } from "@/server/role";
import { getUsersWithRole } from "@/server/user";

export default async function AdminRightPage() {
    const users: TUserTable[] = await getUsersWithRole();
    // const roles = await getRoles();
    return (
        <Card>
            <CardHeader>
                <h1>Admin Right Page</h1>
            </CardHeader>

            <CardContent>
                <DataTable data={users} columns={rightColumns} />
            </CardContent>
        </Card>
    );
}
