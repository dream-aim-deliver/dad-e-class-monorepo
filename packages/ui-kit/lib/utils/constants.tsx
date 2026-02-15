import type { ReactNode } from "react";
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
  Minus,
  Link,
  Unlink,
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
  HorizontalRule = "horizontal-rule",
  Undo = "undo",
  Redo = "redo",
  unlink = "unlink"
}

export const TEXT_FORMAT_OPTIONS = (dictionary: any) => [
  { id: RichTextAction.Bold, icon: <Bold size={16} />, label: dictionary.components.richTextToolbar.bold },
  { id: RichTextAction.Italics, icon: <Italic size={16} />, label: dictionary.components.richTextToolbar.italic },
  { id: RichTextAction.Underline, icon: <Underline size={16} />, label: dictionary.components.richTextToolbar.underline },
  { id: RichTextAction.Highlight, icon: <Highlighter size={16} />, label: dictionary.components.richTextToolbar.highlight },
  { id: RichTextAction.Strikethrough, icon: <Strikethrough size={16} />, label: dictionary.components.richTextToolbar.strikethrough },
  { id: RichTextAction.Superscript, icon: <Superscript size={16} />, label: dictionary.components.richTextToolbar.superscript },
  { id: RichTextAction.Subscript, icon: <Subscript size={16} />, label: dictionary.components.richTextToolbar.subscript },
  { id: RichTextAction.Code, icon: <Code size={16} />, label: dictionary.components.richTextToolbar.code },
];

export const TEXT_BLOCK_OPTIONS = (dictionary: any) => [
  { id: RichTextAction.LeftAlign, icon: <AlignLeft size={16} />, label: dictionary.components.richTextToolbar.leftAlign },
  { id: RichTextAction.CenterAlign, icon: <AlignCenter size={16} />, label: dictionary.components.richTextToolbar.centerAlign },
  { id: RichTextAction.RightAlign, icon: <AlignRight size={16} />, label: dictionary.components.richTextToolbar.rightAlign },
  { id: RichTextAction.JustifyAlign, icon: <AlignJustify size={16} />, label: dictionary.components.richTextToolbar.justifyAlign },
  { id: RichTextAction.BlockQuote, icon: <Quote size={16} />, label: dictionary.components.richTextToolbar.blockQuote },
  { id: RichTextAction.BulletedList, icon: <List size={16} />, label: dictionary.components.richTextToolbar.bulletedList },
  { id: RichTextAction.NumberedList, icon: <ListOrdered size={16} />, label: dictionary.components.richTextToolbar.numberedList },
  { id: RichTextAction.HorizontalRule, icon: <Minus size={16} />, label: dictionary.components.richTextToolbar.horizontalRule },
];

export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
export const TEXT_ACTION_OPTIONS = (dictionary: any) => [
  {
    id: "undo",
    icon: <Undo size={16} />,
    label: dictionary.components.richTextToolbar.undo
  },
  {
    id: "redo",
    icon: <Redo size={16} />,
    label: dictionary.components.richTextToolbar.redo
  },
];

export type ToolbarItemKind = "action" | "mark" | "block" | "link" | "unlink";

export interface ToolbarItem {
  id: string;
  icon: ReactNode;
  label: string;
  kind: ToolbarItemKind;
}

export const TOOLBAR_ITEMS = (dictionary: any, iconSize = 16): ToolbarItem[] => [
  { id: "undo", icon: <Undo size={iconSize} />, label: dictionary.components.richTextToolbar.undo, kind: "action" },
  { id: "redo", icon: <Redo size={iconSize} />, label: dictionary.components.richTextToolbar.redo, kind: "action" },
  { id: "link", icon: <Link size={iconSize} />, label: dictionary.components.richTextToolbar.link, kind: "link" },
  { id: "unlink", icon: <Unlink size={iconSize} />, label: dictionary.components.richTextToolbar.unlink, kind: "unlink" },
  { id: RichTextAction.Bold, icon: <Bold size={iconSize} />, label: dictionary.components.richTextToolbar.bold, kind: "mark" },
  { id: RichTextAction.Italics, icon: <Italic size={iconSize} />, label: dictionary.components.richTextToolbar.italic, kind: "mark" },
  { id: RichTextAction.Underline, icon: <Underline size={iconSize} />, label: dictionary.components.richTextToolbar.underline, kind: "mark" },
  { id: RichTextAction.Highlight, icon: <Highlighter size={iconSize} />, label: dictionary.components.richTextToolbar.highlight, kind: "mark" },
  { id: RichTextAction.Strikethrough, icon: <Strikethrough size={iconSize} />, label: dictionary.components.richTextToolbar.strikethrough, kind: "mark" },
  { id: RichTextAction.Superscript, icon: <Superscript size={iconSize} />, label: dictionary.components.richTextToolbar.superscript, kind: "mark" },
  { id: RichTextAction.Subscript, icon: <Subscript size={iconSize} />, label: dictionary.components.richTextToolbar.subscript, kind: "mark" },
  { id: RichTextAction.Code, icon: <Code size={iconSize} />, label: dictionary.components.richTextToolbar.code, kind: "mark" },
  { id: RichTextAction.LeftAlign, icon: <AlignLeft size={iconSize} />, label: dictionary.components.richTextToolbar.leftAlign, kind: "block" },
  { id: RichTextAction.CenterAlign, icon: <AlignCenter size={iconSize} />, label: dictionary.components.richTextToolbar.centerAlign, kind: "block" },
  { id: RichTextAction.RightAlign, icon: <AlignRight size={iconSize} />, label: dictionary.components.richTextToolbar.rightAlign, kind: "block" },
  { id: RichTextAction.JustifyAlign, icon: <AlignJustify size={iconSize} />, label: dictionary.components.richTextToolbar.justifyAlign, kind: "block" },
  { id: RichTextAction.BlockQuote, icon: <Quote size={iconSize} />, label: dictionary.components.richTextToolbar.blockQuote, kind: "block" },
  { id: RichTextAction.BulletedList, icon: <List size={iconSize} />, label: dictionary.components.richTextToolbar.bulletedList, kind: "block" },
  { id: RichTextAction.NumberedList, icon: <ListOrdered size={iconSize} />, label: dictionary.components.richTextToolbar.numberedList, kind: "block" },
  { id: RichTextAction.HorizontalRule, icon: <Minus size={iconSize} />, label: dictionary.components.richTextToolbar.horizontalRule, kind: "block" },
];
export const HeadingOptions = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" }]



// File type constants for better readability and maintainability
export const ACCEPTED_FILE_TYPES = {
  IMAGE: ['image/*'],
  VIDEO: ['video/*'],
  DOCUMENT: {
    // Office documents
    PDF: 'application/pdf',
    WORD: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    POWERPOINT: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],

    // Text files
    TEXT: 'text/*',
    RTF: 'application/rtf',

    // Archive files
    ZIP: 'application/zip',
    RAR: 'application/x-rar-compressed',
    SEVEN_ZIP: 'application/x-7z-compressed',

    // Data files
    JSON: 'application/json',
    XML: 'application/xml',

    // File extensions (fallback for older browsers)
    EXTENSIONS: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.csv', '.zip', '.rar', '.7z']
  }
} as const;

// Helper function to get all document file types
export const getDocumentFileTypes = (): string[] => {
  const types: string[] = [];

  // Add all document MIME types
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.PDF);
  types.push(...ACCEPTED_FILE_TYPES.DOCUMENT.WORD);
  types.push(...ACCEPTED_FILE_TYPES.DOCUMENT.EXCEL);
  types.push(...ACCEPTED_FILE_TYPES.DOCUMENT.POWERPOINT);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.TEXT);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.RTF);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.ZIP);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.RAR);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.SEVEN_ZIP);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.JSON);
  types.push(ACCEPTED_FILE_TYPES.DOCUMENT.XML);

  // Add file extensions
  types.push(...ACCEPTED_FILE_TYPES.DOCUMENT.EXTENSIONS);

  return types;
};
