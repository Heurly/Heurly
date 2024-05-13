"use client";

import { useState } from "react";
import { Button } from "./button";

export default function TextTruncated({
    maxLength,
    text,
}: { maxLength: number; text: string }) {
    const [seeMore, setSeeMore] = useState(false);

    return (
        <>
            {
                // If the text length is more than 200 and seeMore is false, show a truncated version of the text
                text.length > maxLength && !seeMore ? (
                    <>{text.substring(0, 200)}...</>
                ) : (
                    // Otherwise, show the full text
                    text
                )
            }
            {
                // If the text length is more than 200, show a button to toggle the text display
                text.length > 200 && (
                    <Button
                        variant="link"
                        className="h-0 p-0"
                        onClick={(e) => {
                            e.preventDefault();
                            setSeeMore(!seeMore);
                        }}
                    >
                        {!seeMore ? "Voir plus" : "Voir moins"}
                    </Button>
                )
            }
        </>
    );
}
