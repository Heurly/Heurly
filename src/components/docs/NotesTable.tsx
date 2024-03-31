"use client";

import { Notes } from "@prisma/client";
import DataTable, { DataTableSortableHeader } from "../ui/data-table";
import { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { format } from "date-fns";
import UserProfile from "../profile/UserProfile";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<Notes>[] = [
    {
        accessorKey: "userId",
        header: "Auteur",
        cell: ({ cell }) => (
            <UserProfile userId={cell.row.getValue("userId")} />
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableSortableHeader
                label="Titre"
                action={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            />
        ),
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableSortableHeader
                label="Modification"
                action={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            />
        ),
        cell: ({ cell }) => (
            <p>{format(cell.row.getValue("updatedAt"), "dd/MM/yyyy HH:mm")}</p>
        ),
    },
    {
        accessorKey: "courseCode",
        header: ({ column }) => (
            <DataTableSortableHeader
                label="Cours"
                action={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            />
        ),
    },
    {
        id: "actions",
        // tips in order to find the id
        accessorKey: "id",
        cell: ({ row }) => {
            // see: https://typescript-eslint.io/rules/restrict-template-expressions/
            const url: string & { _kind?: "" } = row.getValue("actions");
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Actions</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/editor/${url || ""}`}>
                            <DropdownMenuItem>
                                <p>Ouvrir</p>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface Props {
    data: Notes[];
}

const initialState: InitialTableState = {
    pagination: {
        pageSize: 5,
    },
};

const NotesTable: React.FunctionComponent<Props> = ({ data }) => (
    <DataTable
        columns={columns}
        data={data ?? []}
        initialState={initialState}
        searchAccessor="title"
    />
);

export default NotesTable;
