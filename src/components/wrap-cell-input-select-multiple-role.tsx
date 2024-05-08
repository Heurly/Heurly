import { addUserRole, deleteUserRole, getRoles } from "@/server/role";
import type { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import CellInputSelectMultiple from "./cell-input-select-multiple";

export default function WrapCellInputSelectMultipleRole({
	userId,
	userRole,
}: {
	userId: string;
	userRole: Role[];
}) {
	const [roles, setRoles] = useState<Role[]>([]);

	const handleAdd = async (userId: string, roleId: string) => {
		await addUserRole(userId, roleId);
	};

	const handleDelete = async (userId: string, roleId: string) => {
		await deleteUserRole(userId, roleId);
	};

	const handleCreate = (name: string) => {
		window.open(`/admin/roles/create?name=${name}`, "_blank");
	};

	useEffect(() => {
		const fetchRole = async () => {
			const resRoles = await getRoles();
			setRoles(resRoles);
		};
		void fetchRole();
	}, []);

	return (
		<CellInputSelectMultiple
			onAdd={(id) => handleAdd(userId, id)}
			onDelete={(id) => handleDelete(userId, id)}
			onCreate={(name) => handleCreate(name)}
			currentOptions={userRole}
			tabOptions={roles}
		/>
	);
}
