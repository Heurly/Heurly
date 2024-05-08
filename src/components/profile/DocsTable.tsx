"use client";

import { deleteDoc } from "@/server/docs";
import type { Docs } from "@prisma/client";
import type { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
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

const columns: ColumnDef<Docs>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableSortableHeader
				label="Titre"
				action={() => column.toggleSorting(column.getIsSorted() === "asc")}
			/>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableSortableHeader
				label="Créé le"
				action={() => column.toggleSorting(column.getIsSorted() === "asc")}
			/>
		),
		cell: ({ cell }) => (
			<p>{format(cell.row.getValue("createdAt"), "dd/MM/yyyy HH:mm")}</p>
		),
	},
	{
		id: "actions",
		accessorKey: "id",
		cell: ({ row }) => {
			// see: https://typescript-eslint.io/rules/restrict-template-expressions/
			const id: string & { _kind?: "not_found" } = row.getValue("actions");

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
						<Link href={`/revision/docs/${id}`}>
							<DropdownMenuItem>
								<p>Ouvrir</p>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={(e) => e.preventDefault()}>
							<ConfirmationDialog
								onConfirm={async () => {
									await deleteDoc(id);
								}}
								title={`Suppression de ${
									row.getValue("title")?.toString() ?? "votre document"
								}`}
								text={`Êtes-vous sûr de vouloir supprimer le document "${
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
	data: Docs[];
	className?: string;
}

const initialState: InitialTableState = {
	pagination: {
		pageSize: 3,
	},
};

const DocsTable: React.FunctionComponent<Props> = ({ data, className }) => (
	<DataTable
		className={className}
		initialState={initialState}
		columns={columns}
		data={data ?? []}
		searchAccessor="title"
	/>
);

export default DocsTable;
