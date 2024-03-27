"use client";
import React, { useState } from "react";
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
    const onCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="relative w-full">
            <Input
                type={type}
                ref={ref}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />

            <CopyToClipboard text={inputValue} onCopy={onCopy}>
                <TooltipProvider>
                    <Tooltip open={copied}>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={"outline"}
                                className=" absolute right-0 top-0 !rounded-md"
                            >
                                <Copy className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copié !</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CopyToClipboard>
        </div>
    );
});

InputCopy.displayName = "InputCopy";

export default InputCopy;
