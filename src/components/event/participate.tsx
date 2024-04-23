"use client";

import { Star } from "lucide-react";
import React from "react";
import cn from "classnames";

type clickEvent = React.MouseEvent<SVGSVGElement, MouseEvent>;

type PropsParticipate = {
    nbParticipants: number;
    hasParticipated: boolean;
    onClickParticipate: (e: clickEvent) => Promise<void>;
    className?: string;
};

const Participate = ({
    hasParticipated,
    onClickParticipate,
    className,
    ...props
}: PropsParticipate) => {
    const [nbParticipants, setParticipate] = React.useState(hasParticipated);

    const handleUpVote = async (e: clickEvent) => {
        setParticipate(!hasParticipated);
        await onClickParticipate(e);
    };

    return (
        <div
            className={cn(
                "grid h-full max-h-24 gap-1 md:grid-cols-2",
                className,
            )}
            {...props}
        >
            <Star
                size="2.5rem"
                strokeWidth={1}
                onClick={async (e) => {
                    e.stopPropagation();
                    await handleUpVote(e);
                }}
                className="max-w-10 cursor-pointer place-self-center"
                fill={nbParticipants ? "hsl(var(--primary))" : "white"}
            />
            <p className="place-self-center md:col-start-2 md:self-center md:justify-self-start">
                {nbParticipants}
            </p>
        </div>
    );
};

export default Participate;
