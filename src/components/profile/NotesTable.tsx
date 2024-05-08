"use client";

import { deleteNotes, setNoteVisibility } from "@/server/notes";
import type { Notes } from "@prisma/client";
import type { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import NotesVisibility from "../docs/NotesVisibility";
import { Button } from "../ui/button";
import ConfirmationDialog from "../ui/confirmation-dialog";
import DataTable, { DataTableSortableHeader } from "../ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const columns: ColumnDef<Notes>[] = [
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
        accessorKey: "public",
        header: ({ column }) => (
            <DataTableSortableHeader
                label="Visibilité"
                action={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            />
        ),
        cell: ({ cell }) => (
            <NotesVisibility isPublic={cell.row.getValue("public")} />
        ),
    },
    {
        id: "actions",
        accessorKey: "id",
        cell: ({ row }) => {
            // see: https://typescript-eslint.io/rules/restrict-template-expressions/
            const id: string & { _kind?: "not_found" } =
                row.getValue("actions");

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
                        <Link href={`/editor/${id}`}>
                            <DropdownMenuItem>
                                <p>Ouvrir</p>
                            </DropdownMenuItem>
                        </Link>
                        {row.getValue("public") ? (
                            <DropdownMenuItem
                                onClick={() => setNoteVisibility(id, false)}
                            >
                                Rendre Privée
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => setNoteVisibility(id, true)}
                            >
                                Rendre Publique
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            <ConfirmationDialog
                                onConfirm={() => deleteNotes(id)}
                                title={`Suppression de ${
                                    row.getValue("title")?.toString() ??
                                    "votre note"
                                }`}
                                text={`Êtes-vous sûr de vouloir supprimer la note "${
                                    row.getValue("title")?.toString() ?? ""
                                }" ?`}
                            >
                                <p>Supprimer</p>
                            </ConfirmationDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface Props {
    data: Notes[];
    className?: string;
}

const initialState: InitialTableState = {
    pagination: {
        pageSize: 3,
    },
};

const NotesTable: React.FunctionComponent<Props> = ({ data, className }) => (
    <DataTable
        className={className}
        initialState={initialState}
        columns={columns}
        data={data ?? []}
        searchAccessor="title"
    />
);

export default NotesTable;
