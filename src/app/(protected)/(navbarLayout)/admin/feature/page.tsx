import { DataTable } from "@/components/data-table";
import { featureDetailsColumns } from "@/components/feature-list-table/feature-column";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoBackButton from "@/components/utils/go-back-button";
import { getFeatures } from "@/server/feature";

export default async function ListFeaturePage() {
    const features = await getFeatures(30);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-start gap-x-5">
                    <GoBackButton /> Admin - Liste des fonctionnalités
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={features ?? []}
                    columns={featureDetailsColumns}
                />
            </CardContent>
        </Card>
    );
}
