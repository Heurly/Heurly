"use client";
import { Lock, LockOpen } from "lucide-react";
import type React from "react";

interface Props {
    isPublic: boolean;
    className?: string;
}

const NotesVisibility: React.FunctionComponent<Props> = ({
    isPublic,
    className,
}) => (
    <div className={className}>
        {isPublic ? (
            <div className="flex items-center gap-2 font-bold text-green-500">
                <LockOpen size={20} />
                <p>Public</p>
            </div>
        ) : (
            <div className="flex items-center gap-2 font-bold text-red-400">
                <Lock size={20} />
                <p>Privé</p>
            </div>
        )}
    </div>
);

export default NotesVisibility;
