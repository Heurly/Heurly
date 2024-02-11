"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getFieldsByLevel } from "@/server/units";
import ID from "@/utils/id";
import type { Unit } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

export default function FormUnits() {
    const [level, setLevel] = useState<number>(2);
    const [fields, setFields] = useState<Unit[]>([]);

    const fetchFields: () => Promise<Unit[]> = useCallback(async () => {
        return await getFieldsByLevel(level);
    }, [level])

    useEffect(() => {
        (async () : Promise<void> => {
            const res = await fetchFields();
            setFields(res);
        }
        )().catch((err) => console.error(err));
    }, [fetchFields])

    return (
        <form>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ecole" />
                </SelectTrigger>
                <SelectContent>
                    {
                        fields?.map(({ id, name }) => (
                            <SelectItem value={String(id)} onClick={() => setLevel(level => level + 1)} key={ID()}>{name}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </form>
    )
}