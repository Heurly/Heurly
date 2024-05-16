"use client";
import { Copy } from "lucide-react";
import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "./button";
import { Input } from "./input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

const InputCopy = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ value, onBlur, type = "text" }, ref) => {
    const [copied, setCopied] = useState(false);
    const [inputValue, setInputValue] = useState<string>(value as string);

    useEffect(() => {
        if (copied) {
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
        <div className="flex w-full">
            <Input
                className="!rounded-r-none"
                type={type}
                ref={ref}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={onBlur}
            />

            <TooltipProvider>
                <Tooltip open={copied}>
                    <CopyToClipboard text={inputValue} onCopy={onCopy}>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={"outline"}
                                className="!rounded-md !rounded-l-none"
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
