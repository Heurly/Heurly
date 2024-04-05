import { Role } from "@prisma/client";
import InputSelectMultiple from "./input-select-multiple";
import { Badge } from "./ui/badge";
import ID from "@/utils/id";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const roles: Role[] = [
    {
        id: "1",
        name: "Admin",
        description: "Admin role",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        name: "User",
        description: "User role",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
const userRole: Role[] = [
    {
        id: "2",
        name: "User",
        description: "User role",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const formattedRoles = roles.map((el) => ({ id: el.id, name: el.name }));
const userRoleFormatted = userRole.map((el) => ({ id: el.id, name: el.name }));
const onRoleSelectChange = async () => {
    console.log("onRoleSelectChange");
};

export default function CellInputSelectMultiple() {
    const [selected, setSelected] = useState(false);

    return (
        <Popover>
            <PopoverTrigger>
                {userRoleFormatted.map((el) => {
                    return (
                        <Badge key={ID()}>
                            <p>{el.name}</p>
                        </Badge>
                    );
                })}
            </PopoverTrigger>
            <PopoverContent className="!p-[unset]">
                <InputSelectMultiple
                    isSelected={selected}
                    tabOptions={formattedRoles}
                    initialOptions={userRoleFormatted}
                    onOptionChange={onRoleSelectChange}
                />
            </PopoverContent>
        </Popover>
    );
}
