"use client";

import type { Feature } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

export const featureDetailsColumns: ColumnDef<Feature>[] = [
	{
		header: "id",
		accessorKey: "id",
	},
	{
		header: "Nom",
		accessorKey: "name",
	},
	{
		header: "Description",
		accessorKey: "description",
	},
	{
		header: "Créé le",
		accessorKey: "createdAt",
	},
	{
		header: "Modifié le",
		accessorKey: "updatedAt",
	},
];
