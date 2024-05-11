"use client";

import { type EditorContextValue, useCurrentEditor } from "@tiptap/react";
import type React from "react";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Textarea } from "../ui/textarea";

export interface ContentToPreview {
    from: number;
    to: number;
    content: string;
    shouldPreview: boolean;
}

interface Props {
    className?: string;
    position: number;
    preview: ContentToPreview;
    setPreview: React.Dispatch<React.SetStateAction<ContentToPreview>>;
}

const EditorKatexInput: React.FunctionComponent<Props> = ({
    className,
    position,
    preview,
    setPreview,
}) => {
    const editor: EditorContextValue = useCurrentEditor();
    const ref = useRef<HTMLTextAreaElement>(null);

    const changeCallback = (s: string | undefined) => {
        if (editor.editor === null || s === undefined || ref.current == null)
            return;

        editor.editor
            .chain()
            .deleteRange({
                from: preview.from,
                to: preview.to,
            })
            // TODO: find a way to get rid of the space but still render the katex
            .insertContent(`$${s}$ `)
            .run();

        setPreview({
            ...preview,
            content: s,
            // +3 to account for the added "$" and " "; the space is added to force the render of the katex
            to: preview.from + s.length + 3,
        });

        ref.current.focus();
    };

    const debouncedChangeCallback = useDebouncedCallback(
        (s: string | undefined) => {
            changeCallback(s);
        },
        500,
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: ref is needed to focus the textarea
    useEffect(() => {
        if (ref.current === null) return;

        ref.current.focus();
        ref.current.selectionStart = position - 1;
    }, [ref, position]);

    return (
        <div className={`absolute flex w-[500px] flex-col ${className}`}>
            <Textarea
                ref={ref}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                        if (ref?.current?.value !== undefined)
                            changeCallback(ref.current.value);
                        setPreview({ ...preview, shouldPreview: false });
                        editor.editor?.chain().focus().run();
                    } else if (e.key === "Escape") {
                        setPreview({ ...preview, shouldPreview: false });
                        editor.editor?.chain().focus().run();
                    }
                }}
                onChange={(e) => {
                    e.stopPropagation();
                    debouncedChangeCallback(e.currentTarget.value);
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
