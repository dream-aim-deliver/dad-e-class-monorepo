

import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";



export type EditorType = BaseEditor & ReactEditor & HistoryEditor;
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

export type AlignKey = "left" | "right" | "center" | "justify";

export type CustomElement = {
  type: string;
  children: (CustomElement | CustomText)[];
  align?: AlignKey;
};

export type MarkKey =
  | "bold"
  | "underline"
  | "superscript"
  | "subscript"
  | "italic"
  | "code"
  | "highlight"
  | "strikethrough";

export type ElementKey =
  | AlignKey
  | "block-quote"
  | "numbered-list"
  | "bulleted-list"
  | "list-item";