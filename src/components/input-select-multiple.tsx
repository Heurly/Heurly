"use client";
import { useRef, useState } from "react";
import { Badge } from "./ui/badge";
import ID from "@/utils/id";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";

export type TOption = {
    id: string;
    name: string;
};

export default function InputSelectMultiple({
    initialOptions,
    tabOptions,
    className,
    onSelectOption,
    onCreateOption,
    onDeleteOption,
}: {
    initialOptions: TOption[];
    tabOptions: TOption[];
    className?: string;
    onSelectOption: (id: string) => void;
    onDeleteOption: (id: string) => void;
    onCreateOption: (name: string) => void;
}) {
    const [actualOptions, setActualOptions] = useState(initialOptions);

    const notSelectedOptions = tabOptions?.filter(
        ({ id }) => !actualOptions?.find((option) => option.id === id),
    );

    const handleBadgeClickAdd = (id: string) => {
        const newOptions = notSelectedOptions?.find(
            (option) => option.id == id,
        );
        if (!newOptions) return;
        setActualOptions([...actualOptions, newOptions]);
        setInputValue("");
        inputRef.current?.focus();
        onSelectOption(id);
    };

    const handleBadgeClickDelete = (id: string) => {
        const newOptions = actualOptions?.filter((option) => option.id !== id);
        if (!newOptions) return;
        setActualOptions(newOptions);
        onDeleteOption(id);
    };

    const [inputValue, setInputValue] = useState("");
    const formattedInputValue = inputValue.trim().toLowerCase();
    const notSelectedOptionsFiltered = notSelectedOptions?.filter(({ name }) =>
        name.trim().toLowerCase().includes(formattedInputValue),
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // if (e.key === "Enter") {
        // }
        if (inputValue === "" && e.key === "Backspace") {
            const lastOption = actualOptions.at(-1);
            if (!lastOption) return;
            handleBadgeClickDelete(lastOption.id);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={cn("overflow-hidden rounded-md", className)}>
            <div className="flex w-full cursor-pointer flex-wrap gap-2 overflow-y-auto border bg-secondary p-2">
                {actualOptions?.map(({ id, name }) => (
                    <Badge className="cursor-pointer" key={ID()}>
                        <p>{name}</p>
                        <CircleX
                            className="ml-1 size-5"
                            onClick={() => handleBadgeClickDelete(id)}
                        />
                    </Badge>
                ))}
                <div className="w-32">
                    <input
                        className="w-full bg-transparent focus:outline-none"
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.currentTarget.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        ref={inputRef}
                    />
                </div>
            </div>
            <div
                className={cn(
                    "static top-full z-50 flex w-full flex-col items-start justify-center bg-white",
                )}
            >
                <p className="p-2 text-sm">Séléctionner ou créez une option</p>
                {notSelectedOptionsFiltered?.map(({ name, id }) => (
                    <div
                        className="flex w-full cursor-pointer items-center justify-start px-2 py-1 hover:bg-secondary"
                        onClick={() => handleBadgeClickAdd(id)}
                        key={ID()}
                    >
                        <Badge className="cursor-pointer" key={ID()}>
                            {name}
                        </Badge>
                    </div>
                ))}
                {inputValue &&
                    !tabOptions.find(
                        ({ name: optionName }) =>
                            optionName.trim().toLowerCase() ==
                            formattedInputValue,
                    ) && (
                        <div
                            className="flex w-full cursor-pointer items-center justify-start px-2 py-1 hover:bg-secondary"
                            onClick={() => onCreateOption(inputValue)}
                        >
                            <p className="flex items-center justify-center text-sm">
                                Créez
                            </p>
                            &nbsp;
                            <Badge>
                                <p className="max-w-28 overflow-hidden text-ellipsis">
                                    {inputValue}
                                </p>
                            </Badge>
                        </div>
                    )}
            </div>
        </div>
    );
}
