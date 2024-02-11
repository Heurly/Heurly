"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import id from "@/utils/id";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";
import cn from "classnames";
import { getAllUnits } from "@/server/units";
import { BoxSelect, Tag } from "lucide-react";
import { ModuleChoice } from "@/types/timetable";
import { addProfileUnit, getProfileUnits } from "@/server/user";

interface Props {
    session: Session;
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
        
        router.refresh();

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
                {selected != undefined &&
                    selected.split(" - ").map((s, index) => (
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
                                {s}
                            </span>
                        </div>
                    ))}
            </div>
            <div className="flex flex-wrap w-full">
                {options.length > 0 &&
                    options.map((o) => (
                        <div
                            key={id()}
                            className={cn(
                                "flex p-1.5 w-fit m-1.5",
                                "bg-sky-100 border border-sky-200 rounded-xl",
                                "hover:text-sky-400 cursor-pointer",
                            )}
                        >
                            <Tag />
                            <span className="pl-2 cursor-pointer" onClick={() => select(o)}>
                                {o}
                            </span>
                        </div>
                    ))}
            </div>
            {isAddable && <Button onClick={addModule}>Ajouter le module</Button>}
        </div>
    );
};

export default FormUnits;