import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

/**
 * Props for the RichTextEditor component.
 */
export interface RichTextEditorProps {
  name: string;
  placeholder: string;
  initialValue: Descendant[] | undefined | string;
  onChange: (value: Descendant[]) => void;
}

/**
 * Custom editor type that extends BaseEditor, ReactEditor, and HistoryEditor.
 */
export type EditorType = BaseEditor & ReactEditor & HistoryEditor;

/**
 * Defines the structure of text formatting options.
 */
export type CustomText = {
  text: string;
  bold?: boolean;
  underline?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  italic?: boolean;
  code?: boolean;
  highlight?: boolean;
  strikethrough?: boolean;
};

/**
 * Alignment options for text blocks.
 */
export type AlignKey = "left" | "right" | "center" | "justify";

/**
 * Defines the structure of a custom element in the editor.
 */
export type CustomElement = {
  type: string;
  url?: string;
  children: (CustomElement | CustomText)[];
  align?: AlignKey;
};

/**
 * Supported text formatting marks.
 */
export type MarkKey =
  | "bold"
  | "underline"
  | "superscript"
  | "subscript"
  | "italic"
  | "code"
  | "highlight"
  | "strikethrough";

/**
 * Supported block-level elements in the editor.
 */
export type ElementKey =
  | AlignKey
  | "block-quote"
  | "numbered-list"
  | "bulleted-list"
  | "list-item"
  | "link"
  | "unlink";