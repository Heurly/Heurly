"use client";

import { SaveState } from "@/types/notes";
import {
	EditorBubble,
	EditorCommand,
	EditorCommandEmpty,
	EditorCommandItem,
	EditorCommandList,
	EditorContent,
	type EditorInstance,
	EditorRoot,
	type JSONContent,
} from "novel";
import { handleCommandNavigation } from "novel/extensions";
import { useState } from "react";
import type { DebouncedState } from "use-debounce";
import { ColorSelector, LinkSelector, NodeSelector, TextButtons } from ".";
import { slashCommand, suggestionItems } from "./EditorCommands";
import { defaultExtensions } from "./EditorExtensions";
import EditorKatexInput, { type ContentToPreview } from "./EditorKatexInput";

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
	const [position, setPosition] = useState<number | undefined>(undefined);
	const [katexPreview, setKatexPreview] = useState<ContentToPreview>({
		from: 0,
		to: 0,
		content: "",
		shouldPreview: false,
	});

	const handleKatex = (editor: EditorInstance) => {
		const from = editor.state.selection.from;
		const focused = editor.$pos(from);

		if (focused?.textContent === undefined) return;

		const katexRegex = /.*?(\$.*?\$).*?/g;

		let captured = katexRegex.exec(focused.textContent)?.[1];
		while (katexPreview.shouldPreview === false && captured !== undefined) {
			console.log(captured);
			const katexIdx = focused.textContent.indexOf(captured);
			const katexStart = focused.from + katexIdx;

			if (from > katexStart && from < katexStart + captured.length) {
				setPosition(from - katexStart);
				setKatexPreview({
					from: katexStart,
					to: katexStart + captured.length,
					content: captured.replaceAll("$", ""),
					shouldPreview: true,
				});

				break;
			}

			captured = katexRegex.exec(focused.textContent)?.[1];
		}
	};

	return (
		<div
			className={className ?? ""}
			onClick={() => setKatexPreview({ ...katexPreview, shouldPreview: false })}
		>
			<EditorRoot>
				<EditorContent
					editorProps={{
						handleDOMEvents: {
							keydown: (_view, event) => handleCommandNavigation(event),
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
							position={position ?? 0}
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
						<NodeSelector open={openNode} onOpenChange={setOpenNode} />
						<LinkSelector open={openLink} onOpenChange={setOpenLink} />
						<TextButtons />
						<ColorSelector open={openColor} onOpenChange={setOpenColor} />
					</EditorBubble>
					<EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
						<EditorCommandEmpty className="px-2 text-muted-foreground">
							Aucun résultat
						</EditorCommandEmpty>
						<EditorCommandList>
							{suggestionItems.map((item) => (
								<EditorCommandItem
									value={item.title}
									onCommand={(val) => item?.command?.(val)}
									className={
										"flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
									}
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
						</EditorCommandList>
					</EditorCommand>
				</EditorContent>
			</EditorRoot>
		</div>
	);
};
export default HeurlyEditor;
