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
        header: "Créé le",
        accessorKey: "createdAt",
    },
    {
        header: "Modifié le",
        accessorKey: "updatedAt",
    },
];
