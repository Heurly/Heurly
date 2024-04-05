"use client";
import { Role } from "@prisma/client";
import { getRoles } from "@/server/role";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import ID from "@/utils/id";

export default function InputModifyRole({
    initialRoles,
    onSelectChange,
}: {
    initialRoles: Role[] | null;
    onSelectChange: (role: Role | null) => void;
}) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [userRoles, setUserRoles] = useState<Role[] | null>(
        initialRoles ?? null,
    );

    const fetchRoles = async () => {
        const roles = await getRoles();
        setRoles(roles);
    };

    // useEffect(() => {
    //     // @ts-ignore
    //     fetchRoles();
    // }, []);

    return (
        <div className="relative h-14 w-full ">
            <div className="bg-red-300">
                {userRoles?.map((userRole) => (
                    <Badge className="cursor-pointer" key={ID()}>
                        {userRole.name}
                    </Badge>
                ))}
            </div>
            <div className="absolute top-full z-50 flex flex-col items-start justify-center bg-blue-400">
                {roles?.map((role) => (
                    <Badge className="cursor-pointer" key={ID()}>
                        {role.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
