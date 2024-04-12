"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Feature } from "@prisma/client";

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
        header: "Créer le",
        accessorKey: "createdAt",
    },
    {
        header: "Modifier le",
        accessorKey: "updatedAt",
    },
];
