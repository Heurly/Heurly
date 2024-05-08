import {
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Sigma,
	Text,
	TextQuote,
} from "lucide-react";
import { createSuggestionItems } from "novel/extensions";
import { Command, renderItems } from "novel/extensions";

export const suggestionItems = createSuggestionItems([
	{
		title: "Texte",
		description: "Un simple texte.",
		searchTerms: ["p", "paragraph", "texte"],
		icon: <Text size={18} />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.toggleNode("paragraph", "paragraph")
				.run();
		},
	},
	{
		title: "To-do List",
		description: "Une liste de cases à cocher.",
		searchTerms: ["todo", "task", "list", "check", "checkbox"],
		icon: <CheckSquare size={18} />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleTaskList().run();
		},
	},
	{
		title: "Titre 1",
		description: "Un titre de grande section.",
		searchTerms: ["title", "big", "large", "titre1", "header1", "heading1"],
		icon: <Heading1 size={18} />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 1 })
				.run();
		},
	},
	{
		title: "Titre 2",
		description: "Un titre de section moyenne.",
		searchTerms: ["subtitle", "medium", "titre2", "header2", "heading2"],
		icon: <Heading2 size={18} />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 2 })
				.run();
		},
	},
	{
		title: "Titre 3",
		description: "Un titre de petite section.",
		searchTerms: ["subtitle", "small", "titre3", "header3", "heading3"],
		icon: <Heading3 size={18} />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 3 })
				.run();
		},
	},
	{
		title: "Liste",
		description: "Une simple liste.",
		searchTerms: ["unordered", "point", "liste"],
		icon: <List size={18} />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleBulletList().run();
		},
	},
	{
		title: "Liste numérotée",
		description: "Une liste numérotée.",
		searchTerms: ["ordered", "liste"],
		icon: <ListOrdered size={18} />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleOrderedList().run();
		},
	},
	{
		title: "Citation",
		description: "Une citation de texte.",
		searchTerms: ["blockquote", "citation"],
		icon: <TextQuote size={18} />,
		command: ({ editor, range }) =>
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.toggleNode("paragraph", "paragraph")
				.toggleBlockquote()
				.run(),
	},
	{
		title: "Code",
		description: "Un extrait de code.",
		searchTerms: ["codeblock"],
		icon: <Code size={18} />,
		command: ({ editor, range }) =>
			editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
	},
	{
		title: "Maths",
		description: "Un extrait mathématique",
		searchTerms: ["maths", "mathématiques", "katex", "equation"],
		icon: <Sigma size={18} />,
		command: ({ editor, range }) =>
			editor.chain().focus().deleteRange(range).insertContent("$$").run(),
	},
]);

export const slashCommand = Command.configure({
	suggestion: {
		items: () => suggestionItems,
		render: renderItems,
	},
});
