"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, LoaderCircle, Search } from "lucide-react";
import { getCoursesForSelect } from "@/server/courses";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { CommandList } from "cmdk";
import { Separator } from "../ui/separator";

export type CourseOption = { value: number; label: string };

interface Props {
    className?: string;
    trigger: React.ReactNode;
    value?: CourseOption;
    setValue: (value: CourseOption) => void;
}

const CoursesSelect: React.FunctionComponent<Props> = ({
    className,
    trigger,
    value,
    setValue,
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const debounceFetchOptions = useDebouncedCallback(
        async (newQuery: string) => {
            const r = await getCoursesForSelect(newQuery);
            setCourses(
                r?.map(
                    (c) =>
                        ({
                            value: c.id,
                            label: c.name ?? c.small_code ?? c.code,
                        }) as CourseOption,
                ) ?? [],
            );
            setLoading(false);
        },
        1000,
    );

    useEffect(() => {
        void debounceFetchOptions(query);
    }, [debounceFetchOptions, query]);

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                    <Command>
                        <div className="flex items-center gap-1">
                            <Search size={20} className="text-gray-400" />
                            <Input
                                className="!border-none focus:!ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                autoFocus
                                value={query}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setLoading(true);
                                    setQuery(e.currentTarget.value);
                                }}
                                placeholder="Cherchez un cours..."
                            />
                            {loading && (
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin text-gray-400"
                                />
                            )}
                        </div>

                        <Separator />
                        <CommandEmpty>
                            {query !== ""
                                ? "Aucun résultat."
                                : "Tapez un nom ou un code."}
                        </CommandEmpty>
                        <CommandList>
                            {courses.map((c) => (
                                <CommandItem
                                    key={c.value}
                                    value={c.value.toString()}
                                    onSelect={() => {
                                        setValue({
                                            label: c.label,
                                            value: c.value,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.value === c.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {c.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default CoursesSelect;
