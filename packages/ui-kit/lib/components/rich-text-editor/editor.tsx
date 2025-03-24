
"use client"
import React, { useState,useEffect } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";

import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";

import Toolbar from "./toolbar";
import { CustomElement, CustomText, EditorType } from "./types";
import { toggleMark } from "./slate"

interface RichTextEditorProps {
  name: string;
  placeholder: string;
  initialValue: Descendant[] | undefined;
  onChange: (value: Descendant[]) => void;

}

declare module "slate" {
  interface CustomTypes {
    Editor: EditorType;
    Element: CustomElement;
    Text: CustomText;
  }
}

const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }
  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }

  return (
    <span
      {...attributes}
      className={[
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.underline && "underline",
        leaf.strikethrough && "line-through",
        leaf.code &&
        "text-black text-sm font-mono bg-gray-200 px-1 py-0.5 rounded",
        leaf.highlight &&
        "bg-yellow-200 text-black border border-yellow-600 px-1",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

export const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const style = { textAlign: element.align };

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          {...attributes}
          style={style}
          className="border-l-2 border-gray-300 pl-2 text-gray-500 italic"
        >
          {children}
        </blockquote>
      );
    case "numbered-list":
      return (
        <ol {...attributes} style={style} className="list-decimal pl-5">
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} style={style} className="list-disc pl-5">
          {children}
        </ul>
      );
    case "list-item":
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );
    case "h1":
      return (
        <h1 {...attributes} style={style} className="text-2xl font-bold">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...attributes} style={style} className="text-xl font-bold">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...attributes} style={style} className="text-lg font-semibold">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...attributes} style={style} className="text-md font-semibold">
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 {...attributes} style={style} className="text-sm font-semibold">
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 {...attributes} style={style} className="text-xs font-semibold">
          {children}
        </h6>
      );
    default:
      return (
        <p {...attributes} style={style} className="text-base">
          {children}
        </p>
      );
  }
};

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ name,onChange, placeholder, initialValue }) {
    const [editor] = useState(withHistory(withReact(createEditor())));

    if (!initialValue) return null;
 
    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
      const key = event.key.toLowerCase();
      if (key === "b" && event.ctrlKey) {
        toggleMark(editor, "bold");
      }
      if (key === "i" && event.ctrlKey) {
        toggleMark(editor, "italic");
      }
      if (key === "u" && event.ctrlKey) {
        toggleMark(editor, "underline");
      }
      if (key === "z" && event.ctrlKey) {
        editor.undo();
      }
      if (key === "y" && event.ctrlKey) {
        editor.redo();
      }
    };

    return (
      <div className="text-white">
        <Slate
          editor={editor}
          initialValue={initialValue}
          onChange={(value)=>onChange(value)}
        >
          <Toolbar />
          <div className="border border-text-primary bg-black text-text-primary rounded-md max-h-96 overflow-y-auto">
            <Editable
              name={name}
              placeholder={placeholder}
              autoFocus
              spellCheck
              style={{
                padding: "16px",
                minHeight: "1em",
                display: "block",
              }}
              renderLeaf={RenderLeaf}
              renderElement={RenderElement}
              onKeyDown={onKeyDown}
            />
          </div>
        </Slate>
      </div>
    );
  }
);

export default RichTextEditor;