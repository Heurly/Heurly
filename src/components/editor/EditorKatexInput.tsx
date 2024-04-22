"use client";
import React, { useEffect, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { EditorContextValue, useCurrentEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";

export interface ContentToPreview {
    from: number;
    to: number;
    content: string;
    shouldPreview: boolean;
}

interface Props {
    className?: string;
    preview: ContentToPreview;
    setPreview: React.Dispatch<React.SetStateAction<ContentToPreview>>;
}

const EditorKatexInput: React.FunctionComponent<Props> = ({
    className,
    preview,
    setPreview,
}) => {
    const editor: EditorContextValue = useCurrentEditor();
    const ref = useRef<HTMLTextAreaElement>(null);

    const changeCallback = useDebouncedCallback((s: string | undefined) => {
        if (editor.editor === null || s == undefined || ref.current == null)
            return;

        editor.editor
            .chain()
            .deleteRange({
                from: preview.from,
                to: preview.to,
            })
            .insertContent(`$${s}$ `)
            .run();

        setPreview({
            ...preview,
            content: s,
            // +3 to account for the added "$" and " "; the space is added to force the render of the katex
            to: preview.from + s.length + 3,
        });

        ref.current.focus();
    }, 500);

    useEffect(() => {
        if (ref.current === null) return;

        ref.current.focus();
    }, [ref]);

    return (
        <div className={`absolute flex w-[500px] flex-col ${className}`}>
            <Textarea
                ref={ref}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                        setPreview({ ...preview, shouldPreview: false });
                    }
                }}
                onChange={(e) => {
                    e.stopPropagation();
                    changeCallback(e.currentTarget.value);
                }}
            >
                {preview.content}
            </Textarea>
            <div className="w-full text-right text-sm text-slate-600">
                {'Tapez "Entrer" pour valider'}
            </div>
        </div>
    );
};

export default EditorKatexInput;
