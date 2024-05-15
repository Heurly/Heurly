import { getUserPublicInfo } from "@/server/user";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
        const fetchUserPublicInfo = async () => {
            let u = null;
            try {
                u = await getUserPublicInfo();
            } catch (e) {
                console.error(e);
            }
            if (u === null) return;
            if (u?.image != null && u.name != null) {
                setInfos({ image: u.image, name: u.name });
            }
        };
        void fetchUserPublicInfo();
    }, []);

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
