"use client";
import React from "react";
import { Textarea } from "../ui/textarea";
import { DebouncedState } from "use-debounce";
import { EditorInstance } from "novel";
import { EditorContextValue, useCurrentEditor } from "@tiptap/react";

interface Props {
    preview: { idx: number; content: string };
    debouncedUpdates: DebouncedState<(editor: EditorInstance) => Promise<void>>;
}

const EditorInput: React.FunctionComponent<Props> = ({
    preview,
    debouncedUpdates,
}) => {
    const editor: EditorContextValue = useCurrentEditor();

    return (
        <Textarea
            autoFocus
            className="z-60"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
                if (editor.editor === null || e?.currentTarget?.value === null)
                    return;

                const node = editor.editor.state.doc.nodeAt(preview.idx);
                if (node === null) return;

                editor.editor
                    .chain()
                    .deleteRange({
                        from: preview.idx,
                        to: preview.content.length,
                    })
                    .setNode("paragraph", {
                        text: `$${e.currentTarget.value}$`,
                    })
                    .run();
                console.log(editor.editor);
            }}
        >
            {preview.content.substring(1, preview.content.length - 1)}
        </Textarea>
    );
};

export default EditorInput;
