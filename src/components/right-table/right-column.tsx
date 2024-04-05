"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import nameToInitials from "@/utils/nameToInitials";
import InputSelectMultiple from "../input-select-multiple";
import { Role, User, UserRole } from "@prisma/client";
import CellInputSelectMultiple from "../cell-input-select-multiple";

export type TUserTable = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    UserRole: { role: { id: string; name: string } }[];
};

const handleUserRoleChange = async (
    newRole: Role | null,
    userId: User["id"],
    previousRoleId: Role["id"],
) => {
    // await updateRole()
    // console.log(role, userId);
};

export const rightColumns: ColumnDef<TUserTable>[] = [
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
        cell: ({ row }) => <CellInputSelectMultiple />,
    },
];
