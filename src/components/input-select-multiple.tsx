"use client";
import { useState } from "react";
import { Badge } from "./ui/badge";
import ID from "@/utils/id";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import { Input } from "./ui/input";

export type TOption = {
    id: string;
    name: string;
};

export default function InputSelectMultiple({
    initialOptions,
    onOptionChange,
    tabOptions,
    className,
}: {
    initialOptions: TOption[];
    onOptionChange: (id: string) => void;
    tabOptions: TOption[];
    className?: string;
    isSelected: boolean;
}) {
    const [actualOptions, setActualOptions] = useState(initialOptions);

    const handleBadgeClick = (id: string) => {
        const newOptions = actualOptions?.find((option) => option.id !== id);
        if (!newOptions) return;
        setActualOptions([newOptions, ...actualOptions]);
        // onOptionChange(id);
    };

    const notSelectedOptions = tabOptions?.filter(
        ({ id }) => !actualOptions?.find((option) => option.id === id),
    );

    const [inputValue, setInputValue] = useState("");

    const notSelectedOptionsFiltered = notSelectedOptions?.filter(({ name }) =>
        name.includes(inputValue),
    );

    return (
        <div>
            <div className="flex w-full cursor-pointer flex-wrap gap-2 overflow-y-auto border bg-secondary p-2">
                {actualOptions?.map(({ name }) => (
                    <Badge className="cursor-pointer" key={ID()}>
                        <p>{name}</p>
                        <CircleX className="ml-1 size-5" />
                    </Badge>
                ))}
                <Input
                    className="!w-fit border-none bg-transparent"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>
            <div
                className={cn(
                    "static top-full z-50 flex w-full flex-col items-start justify-center bg-blue-400 bg-border p-2",
                )}
            >
                {notSelectedOptionsFiltered?.map(({ name, id }) => (
                    <Badge
                        className="cursor-pointer"
                        key={ID()}
                        onClick={() => handleBadgeClick(id)}
                    >
                        {name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
