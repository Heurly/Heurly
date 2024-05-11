"use client";

import type { Docs } from "@prisma/client";
import type { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import UserProfile from "../profile/UserProfile";
import { Button } from "../ui/button";
import DataTable, { DataTableSortableHeader } from "../ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const columns: ColumnDef<Docs>[] = [
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
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableSortableHeader
                label="Télécharger"
                action={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            />
        ),
        cell: ({ cell }) => (
            <p>{format(cell.row.getValue("createdAt"), "dd/MM/yyyy HH:mm")}</p>
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
                        <Link href={`/revision/docs/${url || ""}`}>
                            <DropdownMenuItem>
                                <p>Ouvrir</p>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface Props {
    data: Docs[];
}

const initialState: InitialTableState = {
    pagination: {
        pageSize: 5,
    },
};

const DocsTable: React.FunctionComponent<Props> = ({ data }) => (
    <DataTable
        columns={columns}
        data={data ?? []}
        initialState={initialState}
        searchAccessor="title"
    />
);

export default DocsTable;
