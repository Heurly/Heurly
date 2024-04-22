"use client";

import {
    EditorContent,
    EditorRoot,
    EditorInstance,
    JSONContent,
    EditorCommand,
    EditorCommandEmpty,
    EditorCommandItem,
    EditorBubble,
    EditorCommandList,
} from "novel";
import { DebouncedState } from "use-debounce";
import { slashCommand, suggestionItems } from "./EditorCommands";
import { defaultExtensions } from "./EditorExtensions";
import { ColorSelector, LinkSelector, NodeSelector, TextButtons } from ".";
import { useState } from "react";
import { handleCommandNavigation } from "novel/extensions";
import { SaveState } from "@/types/notes";
import EditorKatexInput, { ContentToPreview } from "./EditorKatexInput";

const katexRegex = /.*?(\$.*?\$).*?/;

interface Props {
    canEdit?: boolean;
    className?: string;
    children?: React.ReactNode;
    initialContent?: JSONContent;
    debouncedUpdates: DebouncedState<(editor: EditorInstance) => Promise<void>>;
    setSaveState?: (state: SaveState) => void;
}

const HeurlyEditor: React.FunctionComponent<Props> = ({
    className,
    children,
    initialContent,
    debouncedUpdates,
    canEdit,
    setSaveState,
}) => {
    const [openNode, setOpenNode] = useState<boolean>(false);
    const [openLink, setOpenLink] = useState<boolean>(false);
    const [openColor, setOpenColor] = useState<boolean>(false);
    const [katexPreview, setKatexPreview] = useState<ContentToPreview>({
        from: 0,
        to: 0,
        content: "",
        shouldPreview: false,
    });

    const handleKatex = (editor: EditorInstance) => {
        const from = editor.state.selection.from;
        const focused = editor.$pos(from);

        if (focused?.textContent == undefined) return;
        const res = katexRegex.exec(focused.textContent);
        console.log(res);

        if (
            katexPreview.shouldPreview === false &&
            res !== null &&
            res.length > 0
        ) {
            let katexIdx = focused.textContent.indexOf("$");
            let katexCount = 0;

            while (katexIdx !== -1) {
                katexCount++;
                const katexStart = focused.from + katexIdx;
                const katexContent = res[katexCount];

                if (
                    katexContent !== undefined &&
                    from > katexStart &&
                    from < katexStart + katexContent.length
                ) {
                    setKatexPreview({
                        from: katexStart,
                        to: katexStart + katexContent.length,
                        content: katexContent.replaceAll("$", ""),
                        shouldPreview: true,
                    });

                    break;
                }

                katexIdx = focused.textContent.indexOf("$", katexIdx + 1);
            }
        }
    };

    return (
        <div
            className={className ?? ""}
            onClick={() =>
                setKatexPreview({ ...katexPreview, shouldPreview: false })
            }
        >
            <EditorRoot>
                <EditorContent
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) =>
                                handleCommandNavigation(event),
                        },
                    }}
                    editable={canEdit ?? false}
                    className="size-full"
                    extensions={[...defaultExtensions, slashCommand]}
                    initialContent={initialContent ?? undefined}
                    onUpdate={({ editor }) => {
                        setSaveState?.(SaveState.Saving);

                        handleKatex(editor);

                        void debouncedUpdates(editor);
                    }}
                >
                    {children}
                    {katexPreview.shouldPreview && (
                        <EditorKatexInput
                            preview={katexPreview}
                            setPreview={setKatexPreview}
                        />
                    )}
                    <EditorBubble
                        tippyOptions={{
                            placement: "top",
                        }}
                        className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
                    >
                        <NodeSelector
                            open={openNode}
                            onOpenChange={setOpenNode}
                        />
                        <LinkSelector
                            open={openLink}
                            onOpenChange={setOpenLink}
                        />
                        <TextButtons />
                        <ColorSelector
                            open={openColor}
                            onOpenChange={setOpenColor}
                        />
                    </EditorBubble>
                    <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                        <EditorCommandEmpty className="px-2 text-muted-foreground">
                            Aucun résultat
                        </EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map((item) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(val) =>
                                        item?.command && item.command(val)
                                    }
                                    className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                                    key={item.title}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>
                </EditorContent>
            </EditorRoot>
        </div>
    );
};
export default HeurlyEditor;
