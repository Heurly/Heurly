"use client";

import {
    EditorContent,
    EditorRoot,
    EditorInstance,
    JSONContent,
    EditorCommand,
    EditorCommandEmpty,
    EditorCommandItem,
} from "novel";
import { DebouncedState } from "use-debounce";
import { slashCommand, suggestionItems } from "./EditorCommands";
import { defaultExtensions } from "./EditorExtensions";

interface Props {
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
}) => {
    return (
        <div className={className ?? ""}>
            <EditorRoot>
                <EditorContent
                    autofocus="end"
                    extensions={[...defaultExtensions, slashCommand]}
                    initialContent={initialContent}
                    onUpdate={({ editor, transaction }) =>
                        debouncedUpdates(editor)
                    }
                >
                    {children}
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
