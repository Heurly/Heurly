import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUserPublicInfo } from "@/server/user";

interface Props {
    userId: string;
}

interface UserInfos {
    image: string;
    name: string;
}

const UserProfile: React.FunctionComponent<Props> = ({ userId }) => {
    const [infos, setInfos] = useState<UserInfos | undefined>(undefined);

    useEffect(() => {
        void getUserPublicInfo(userId).then((u) => {
            if (u?.image != null && u.name != null)
                setInfos({ image: u.image, name: u.name });
        });
    }, [userId]);

    return (
        <div className="flex items-center gap-5">
            <Avatar>
                <AvatarImage
                    src={infos?.image ?? ""}
                    alt={infos?.name ?? "?"}
                />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <p>{infos?.name ?? "chargement..."}</p>
        </div>
    );
};

export default UserProfile;
