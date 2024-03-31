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
} from "novel";
import { DebouncedState } from "use-debounce";
import { slashCommand, suggestionItems } from "./EditorCommands";
import { defaultExtensions } from "./EditorExtensions";
import { ColorSelector, LinkSelector, NodeSelector, TextButtons } from ".";
import { useState } from "react";

interface Props {
    canEdit?: boolean;
    className?: string;
    children?: React.ReactNode;
    initialContent?: JSONContent;
    debouncedUpdates: DebouncedState<(editor: EditorInstance) => Promise<void>>;
}

const HeurlyEditor: React.FunctionComponent<Props> = ({
    className,
    children,
    initialContent,
    debouncedUpdates,
    canEdit,
}) => {
    const [openNode, setOpenNode] = useState<boolean>(false);
    const [openLink, setOpenLink] = useState<boolean>(false);
    const [openColor, setOpenColor] = useState<boolean>(false);

    return (
        <div className={className ?? ""}>
            <EditorRoot>
                <EditorContent
                    editable={canEdit ?? false}
                    className="h-full w-full"
                    extensions={[...defaultExtensions, slashCommand]}
                    initialContent={initialContent}
                    onUpdate={({ editor }) => debouncedUpdates(editor)}
                >
                    {children}
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
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </EditorCommandItem>
                        ))}
                    </EditorCommand>
                </EditorContent>
            </EditorRoot>
        </div>
    );
};
export default HeurlyEditor;
