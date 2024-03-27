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

export type TUserTable = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    UserRole: { role: { id: string; name: string } }[];
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
        cell: () => {
            return (
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            );
        },
    },
];
