"use client";

import type { UserWithRole } from "@/server/user";
import nameToInitials from "@/utils/nameToInitials";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import WrapCellInputSelectMultipleRole from "../wrap-cell-input-select-multiple-role";

export const rightColumns: ColumnDef<UserWithRole>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Image",
        accessorKey: "image",
        cell: ({ row }) => {
            return (
                <Avatar>
                    <AvatarImage
                        src={row.getValue("image") ?? ""}
                        alt={row.getValue("name") ?? ""}
                    />
                    <AvatarFallback>
                        {nameToInitials(row.getValue("name"))}
                    </AvatarFallback>
                </Avatar>
            );
        },
    },
    {
        header: "Nom",
        accessorKey: "name",
    },
    {
        header: "Courriel",
        accessorKey: "email",
    },
    {
        header: "Rôle",
        accessorKey: "role",
        cell: ({ row }) => (
            <WrapCellInputSelectMultipleRole
                userId={row.getValue("id")}
                userRole={row.original.UserRole.map((el) => el.role)}
            />
        ),
    },
];
