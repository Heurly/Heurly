"use client";
import ID from "@/utils/id";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import InputSelectMultiple from "./input-select-multiple";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type TcurrentOption = {
	id: string;
	name: string;
};

export default function CellInputSelectMultiple({
	currentOptions,
	onAdd,
	onDelete,
	onCreate,
	tabOptions,
}: {
	onAdd: (id: string) => void;
	onDelete: (id: string) => void;
	onCreate: (name: string) => void;
	currentOptions: TcurrentOption[];
	tabOptions: TcurrentOption[];
}) {
	const [userOptions, setUserOptions] = useState<TcurrentOption[]>(
		currentOptions ?? [],
	);
	const [allOptions, setAllOptions] = useState<TcurrentOption[]>(
		tabOptions ?? [],
	);

	useEffect(() => {
		setAllOptions(tabOptions);
	}, [tabOptions]);

	const handleDelete = async (id: string) => {
		onDelete(id);
		setUserOptions(userOptions.filter((el) => el.id !== id));
	};

	const handleCreate = async (name: string) => {
		onCreate(name);
		setUserOptions([...userOptions, { id: ID(), name }]);
	};

	const handleAdd = async (id: string) => {
		onAdd(id);
		const optionAdd = allOptions.find((el) => el.id === id);
		if (!optionAdd) return;
		setUserOptions([...userOptions, optionAdd]);
	};

	return (
		<Popover>
			<PopoverTrigger>
				<div className="flex w-full max-w-72 flex-wrap gap-2">
					{userOptions?.map(({ name }) => {
						return (
							<Badge key={ID()}>
								<p>{name}</p>
							</Badge>
						);
					})}
				</div>

				{userOptions.length === 0 && (
					<div className="flex items-center justify-center">
						<p className="text-xs text-primary">Rajouter</p>{" "}
						<CirclePlus className="ml-2 size-5 text-primary" />
					</div>
				)}
			</PopoverTrigger>
			<PopoverContent className="!p-[unset]">
				<InputSelectMultiple
					tabOptions={allOptions}
					initialOptions={userOptions}
					onSelectOption={handleAdd}
					onCreateOption={handleCreate}
					onDeleteOption={handleDelete}
				/>
			</PopoverContent>
		</Popover>
	);
}
