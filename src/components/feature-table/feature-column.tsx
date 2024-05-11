"use client";

import type { RoleWithFeatures } from "@/server/role";
import type { ColumnDef } from "@tanstack/react-table";
import WrapCellInputSelectMultipleFeature from "../wrap-cell-input-select-multiple-role-feature";

export const featureColumns: ColumnDef<RoleWithFeatures>[] = [
    {
        header: "Rôle",
        accessorKey: "name",
    },
    {
        header: "Features",
        accessorKey: "features",
        cell: ({ row }) => {
            return (
                <WrapCellInputSelectMultipleFeature
                    roleFeatures={row.original.features}
                    roleId={row.original.id}
                />
            );
        },
    },
];
