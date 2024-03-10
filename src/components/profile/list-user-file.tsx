import { getDocs } from "@/server/docs";
import type { User } from "@prisma/client";
import React from "react";
import { Card } from "@/components/ui/card";
import ID from "@/utils/id";

type PropsListUserFile = {
    userId: User["id"];
    className?: string
};

const ListUserFile = React.forwardRef<HTMLDivElement, PropsListUserFile>(async() => {

    const fileList = await getDocs();
    return (
        <div>
            {
                fileList?.map((file) => {
                    return (
                        <Card key={ID()}>
                            <h3>{file.title}</h3>
                            <p>{file.description}</p>
                            <a href={file.url ?? ""}>Download</a>
                        </Card>
                    )
                })
            }
        </div>
    )
})

ListUserFile.displayName = "ListUserFile";
export default ListUserFile;