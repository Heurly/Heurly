"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import id from "@/utils/id";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Session } from "next-auth";
import cn from "classnames";
import { getAllUnits } from "@/server/units";
import { BoxSelect, Tag } from "lucide-react";
import { ModuleChoice } from "@/types/timetable";
import { addProfileUnit, getProfileUnits } from "@/server/user";
import { Metadata } from "next";
import ID from "@/utils/id";

interface Props {
    session: Session;
}

export const metadata: Metadata = {
    title: "Emplois du temps"
}

const FormUnits: React.FunctionComponent<Props> = ({ session }) => {
    const router = useRouter();
    const [modules, setModules] = useState<ModuleChoice[]>();
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [options, setOptions] = useState<string[]>([]);
    const [isAddable, setIsAddable] = useState<boolean>(false);

    const addModule = useCallback(async () => {
        if (modules == undefined) return;
        const toAdd = modules.find((m) => m.label === selected);
        const userModules = await getProfileUnits(session.user.id)

        if (toAdd == undefined || userModules.find((code) => code === toAdd.code)) return;

        await addProfileUnit(session.user.id, toAdd.code);

        // router.refresh();

    }, [selected, modules]);

    const select = (selection: string) => {
        if (selected == undefined) setSelected(selection);

        setSelected(selected?.concat(` - ${selection}`));
    };

    const unselect = (level: number) => {
        if (selected == undefined || level == 0) return;

        setSelected(selected.split(" - ").slice(0, level).join(" - "));
    };

    useEffect(() => {
        (async () => {
            const allUnits = await getAllUnits();
            setModules(allUnits);
            setSelected(allUnits[0]?.label.split(" - ")[0]);
        })().catch(e => console.error(e))
    }, []);

    useEffect(() => {
        if (modules == undefined || selected == undefined) return;
        const opts: string[] = [];
        const selection = selected.split(" - ");

        modules.forEach((m) => {
            if (m.label.includes(selected)) {
                const current = m.label.split(" - ");
                if (current.length <= selection.length) return;

                const opt = current.at(selection.length);
                if (opt == undefined) return;

                const existing = opts.find((o) => o === opt);

                if (existing == undefined) {
                    opts.push(opt);
                }
            }
        });

        setOptions(opts);
        setIsAddable(modules.find((m) => m.label === selected) != undefined);
    }, [selected, modules]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap mb-4 bg-sky-100 p-4 rounded-xl">
                {
                    selected?.split(" - ").map((optionSelected, index) => (
                        <div
                            key={id()}
                            className={cn(
                                "flex p-1.5 w-fit mb-1 mr-1.5",
                                "bg-sky-200 border border-sky-200 rounded-xl",
                                "hover:text-red-400 cursor-pointer",
                            )}
                        >
                            <BoxSelect />
                            <span
                                className="pl-2 cursor-pointer"
                                onClick={() => unselect(index)}
                            >
                                {optionSelected}
                            </span>
                        </div>
                    ))}
            </div>
            {/* need to review */}
            {/* https://css-tricks.com/almanac/properties/g/grid-auto-flow/ */}
            <div className="flex flex-wrap gap-3 max-h-52 overflow-auto">
                {
                    options?.map((option) => (
                        <div key={ID()} className={cn(
                            "flex gap-x-3", buttonVariants({ variant: "outline" }))}>
                            {option}
                        </div>
                    ))
                }
            </div>
            {
                isAddable && (
                    <div className="flex flex-col gap-y-5">
                        <Button onClick={addModule}>Ajouter un autre module</Button>
                        <Button>J&apos;ai fini !</Button>
                    </div>
                )
            }
        </div >
    );
};

export default FormUnits;