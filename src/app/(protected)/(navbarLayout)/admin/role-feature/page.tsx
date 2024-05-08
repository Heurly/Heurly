import { DataTable } from "@/components/data-table";
import { featureColumns } from "@/components/feature-table/feature-column";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoBackButton from "@/components/utils/go-back-button";
import { getRolesFeaturesByRole } from "@/server/role";

export default async function RoleFeaturePage() {
	const data = await getRolesFeaturesByRole();

	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex items-center justify-start gap-x-5">
					<GoBackButton /> <h1>Admin - Fonctionnalité par rôle</h1>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable data={data} columns={featureColumns} />
			</CardContent>
		</Card>
	);
}
