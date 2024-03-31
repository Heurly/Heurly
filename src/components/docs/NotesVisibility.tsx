"use client";
import { Lock, LockOpen } from "lucide-react";
import React from "react";

interface Props {
    isPublic: boolean;
}

const NotesVisibility: React.FunctionComponent<Props> = ({ isPublic }) => (
    <>
        {isPublic ? (
            <div className="flex items-center gap-2 text-green-400">
                <LockOpen size={15} />
                <p>Public</p>
            </div>
        ) : (
            <div className="flex items-center gap-2 text-red-400">
                <Lock size={15} />
                <p>Privé</p>
            </div>
        )}
    </>
);

export default NotesVisibility;
