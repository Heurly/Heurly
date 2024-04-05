"use client";
import { Role, User } from "@prisma/client";
import InputSelectMultiple from "./input-select-multiple";
import { Badge } from "./ui/badge";
import ID from "@/utils/id";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { addUserRole, deleteUserRole, getRoles } from "@/server/role";
import { log, TLog } from "@/logger/logger";
import { useToast } from "@/components/ui/use-toast";
import { CirclePlus } from "lucide-react";

export default function CellInputSelectMultiple({
    userId,
    currentUserRoles,
}: {
    userId: User["id"];
    currentUserRoles: Role[] | null;
}) {
    const { toast } = useToast();

    const [userRole, setUserRole] = useState<Role[] | null>(
        currentUserRoles ?? null,
    );
    const [tabRoles, setTabRoles] = useState<Role[]>([]);
    const userRoleFormatted =
        userRole?.map((el) => ({ id: el.id, name: el.name })) ?? [];
    const formattedTabRoles = tabRoles.map((el) => ({
        id: el.id,
        name: el.name,
    }));

    const handleRoleSelectedChange = async (roleId: Role["id"]) => {
        log({
            type: TLog.info,
            text: `Role selected: ${roleId}`,
        });

        let resAddUserRole = null;

        try {
            // add role to user
            resAddUserRole = await addUserRole(userId, roleId);

            // update the userRole state
            const roleToAdd = tabRoles.find((el) => el.id === roleId);

            if (!roleToAdd)
                throw new Error("Role not found in the tabRoles array");

            const newUserRoles = userRole
                ? [...userRole, roleToAdd]
                : [roleToAdd];
            if (!newUserRoles)
                throw new Error("Error adding role to user on the UI");
            setUserRole(newUserRoles); // Ensure newUserRoles is always defined
        } catch (e) {
            if (e instanceof Error) {
                log({
                    type: TLog.error,
                    text: `Error adding role to user: ${e.message}`,
                });
            }
        }

        // show to the user an error
        if (!resAddUserRole) {
            toast({
                title: "Erreur",
                description:
                    "Une erreur est survenue lors de l'ajout du rôle à l'utilisateur",
            });
        }
    };

    const handleDeleteOption = async (roleId: Role["id"]) => {
        log({
            type: TLog.info,
            text: `Role deleted: ${roleId}`,
        });
        let resDeleteUserRole = null;

        try {
            resDeleteUserRole = await deleteUserRole(userId, roleId);
        } catch (e) {
            if (e instanceof Error) {
                log({
                    type: TLog.error,
                    text: `Error deleting role to user: ${e.message}`,
                });
            }
        }

        if (!resDeleteUserRole)
            throw new Error("Error deleting role to user on the server");

        const newUserRoles = userRole?.filter((el) => el.id !== roleId);
        if (!newUserRoles)
            throw new Error("Error deleting role to user on the UI");
        setUserRole(newUserRoles);
    };

    const handleCreateOption = async (name: string) => {
        console.log("handleCreateOption");
        // router.push(`/admin/role/create`);
        window.open(`/admin/role/create?name=${name}`, "_blank");
    };

    useEffect(() => {
        // @ts-ignore
        const fetchRoles = async () => {
            try {
                const userRoles = await getRoles();
                setTabRoles(userRoles);
            } catch (error) {
                if (error instanceof Error) {
                    log({
                        type: TLog.info,
                        text: `Failed to fetch roles: ${error.message}`,
                    });
                }
            }
        };

        void fetchRoles();
    }, []);

    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex w-full gap-2">
                    {userRoleFormatted?.map(({ name }) => {
                        return (
                            <Badge key={ID()}>
                                <p>{name}</p>
                            </Badge>
                        );
                    })}
                </div>

                {userRoleFormatted.length == 0 && (
                    <div className="flex items-center justify-center">
                        <p className="text-xs text-primary">Rajouter un rôle</p>{" "}
                        <CirclePlus className="ml-2 size-5 text-primary" />
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent className="!p-[unset]">
                <InputSelectMultiple
                    tabOptions={formattedTabRoles}
                    initialOptions={userRoleFormatted}
                    onSelectOption={handleRoleSelectedChange}
                    onCreateOption={handleCreateOption}
                    onDeleteOption={handleDeleteOption}
                />
            </PopoverContent>
        </Popover>
    );
}
