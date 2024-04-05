"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import nameToInitials from "@/utils/nameToInitials";
import CellInputSelectMultiple from "../cell-input-select-multiple";
import { UserWithRole } from "@/server/user";

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
        cell: ({ row }) => {
            return (
                <CellInputSelectMultiple
                    userId={row.getValue("id")}
                    currentUserRoles={row.original.UserRole.map(
                        (el) => el.role,
                    )}
                />
            );
        },
    },
];
