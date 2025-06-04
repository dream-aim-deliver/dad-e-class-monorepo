import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  Highlighter,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

export enum RichTextAction {
  Bold = "bold",
  Italics = "italic",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Superscript = "superscript",
  link = "link",
  Subscript = "subscript",
  Highlight = "highlight",
  Code = "code",
  LeftAlign = "left",
  CenterAlign = "center",
  RightAlign = "right",
  JustifyAlign = "justify",
  Divider = "divider",
  BlockQuote = "block-quote",
  NumberedList = "numbered-list",
  BulletedList = "bulleted-list",
  Undo = "undo",
  Redo = "redo",
  unlink = "unlink"
}

export const TEXT_FORMAT_OPTIONS = (dictionary: any) => [
  { id: RichTextAction.Bold, icon: <Bold size={24} />, label: dictionary.components.richTextToolbar.bold },
  { id: RichTextAction.Italics, icon: <Italic size={24} />, label: dictionary.components.richTextToolbar.italic },
  { id: RichTextAction.Underline, icon: <Underline size={24} />, label: dictionary.components.richTextToolbar.underline },
  { id: RichTextAction.Highlight, icon: <Highlighter size={24} />, label: dictionary.components.richTextToolbar.highlight },
  { id: RichTextAction.Strikethrough, icon: <Strikethrough />, label: dictionary.components.richTextToolbar.strikethrough },
  { id: RichTextAction.Superscript, icon: <Superscript />, label: dictionary.components.richTextToolbar.superscript },
  { id: RichTextAction.Subscript, icon: <Subscript />, label: dictionary.components.richTextToolbar.subscript },
  { id: RichTextAction.Code, icon: <Code />, label: dictionary.components.richTextToolbar.code },
];

export const TEXT_BLOCK_OPTIONS = (dictionary: any) => [
  { id: RichTextAction.LeftAlign, icon: <AlignLeft size={24} />, label: dictionary.components.richTextToolbar.leftAlign },
  { id: RichTextAction.CenterAlign, icon: <AlignCenter size={24} />, label: dictionary.components.richTextToolbar.centerAlign },
  { id: RichTextAction.RightAlign, icon: <AlignRight size={24} />, label: dictionary.components.richTextToolbar.rightAlign },
  { id: RichTextAction.JustifyAlign, icon: <AlignJustify size={24} />, label: dictionary.components.richTextToolbar.justifyAlign },
  { id: RichTextAction.BlockQuote, icon: <Quote size={24} />, label: dictionary.components.richTextToolbar.blockQuote },
  { id: RichTextAction.BulletedList, icon: <List size={24} />, label: dictionary.components.richTextToolbar.bulletedList },
  { id: RichTextAction.NumberedList, icon: <ListOrdered size={24} />, label: dictionary.components.richTextToolbar.numberedList },
];

export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
export const TEXT_ACTION_OPTIONS = (dictionary: any) => [
  {
    id: "undo", // You may need to define these actions in your Slate commands
    icon: <Undo size={24} />,
    label: dictionary.components.richTextToolbar.undo

  },
  {
    id: "redo",
    icon: <Redo size={24} />,
    label: dictionary.components.richTextToolbar.redo

  },
];
export const HeadingOptions = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" }]