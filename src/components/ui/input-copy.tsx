"use client";
import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "./button";
import { Input } from "./input";
import { Copy } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

const InputCopy = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ value, type = "text" }, ref) => {
    const [copied, setCopied] = useState(false);
    const [inputValue, setInputValue] = useState<string>(value as string);

    useEffect(() => {
        if (copied) {
            console.log("Copied:", copied);
            // Reset copied state after some time
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]); // Depend on copied state

    const onCopy = () => {
        setCopied(true);
    };

    return (
        <div className="relative w-full">
            <Input
                type={type}
                ref={ref}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />

            <TooltipProvider>
                <Tooltip open={copied}>
                    <CopyToClipboard text={inputValue} onCopy={onCopy}>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={"outline"}
                                className=" absolute right-0 top-0 !rounded-md"
                            >
                                <Copy className="size-5" />
                            </Button>
                        </TooltipTrigger>
                    </CopyToClipboard>
                    <TooltipContent>
                        <p>Copié !</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
});

InputCopy.displayName = "InputCopy";

export default InputCopy;
