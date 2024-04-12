import CellInputSelectMultiple from "./cell-input-select-multiple";
import { useEffect, useState } from "react";
import { Feature, Role } from "@prisma/client";
import { getFeatures } from "@/server/feature";
import { addRoleFeature, deleteRight } from "@/server/right";

export default function WrapCellInputSelectMultipleFeature({
    roleId,
    roleFeatures,
}: {
    roleId: Role["id"];
    roleFeatures: Feature[];
}) {
    const [features, setFeatures] = useState<Feature[]>([]);

    const handleAdd = async (roleId: Role["id"], featureId: Feature["id"]) => {
        await addRoleFeature(roleId, featureId);
    };

    const handleDelete = async (
        roleId: Role["id"],
        featureId: Feature["id"],
    ) => {
        console.log(roleId, featureId);
        await deleteRight(roleId, featureId);
    };

    const handleCreate = (name: string) => {
        window.open(`/admin/feature/create?name=${name}`, "_blank");
    };

    useEffect(() => {
        const fetchFeatures = async () => {
            const resGetFeatures = await getFeatures();
            if (resGetFeatures === null)
                throw new Error("Error fetching features");
            setFeatures(resGetFeatures);
        };
        void fetchFeatures();
    }, []);

    return (
        <CellInputSelectMultiple
            onAdd={(id) => handleAdd(roleId, id)}
            onDelete={(id) => handleDelete(roleId, id)}
            onCreate={(name) => handleCreate(name)}
            currentOptions={roleFeatures}
            tabOptions={features}
        />
    );
}
