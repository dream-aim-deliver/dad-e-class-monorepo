import React, { useState } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";

import Toolbar from "./toolbar";
import { CustomElement, CustomText, EditorType, RichTextEditorProps } from "./types";
import { toggleMark } from "./slate";
import { serialize, deserialize } from "./serializer";


/**
 * Extending Slate's CustomTypes to define custom editor, element, and text types.
 */
declare module "slate" {
  interface CustomTypes {
    Editor: EditorType;
    Element: CustomElement;
    Text: CustomText;
  }
}

/**
 * Renders text leaves with specific formatting styles.
 * Supports bold, italic, underline, strikethrough, code, highlight, superscript, and subscript.
 */
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
        leaf.code && "text-black text-sm font-mono bg-gray-200 px-1 py-0.5 rounded",
        leaf.highlight && "bg-yellow-200 text-black border border-yellow-600 px-1",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

/**
 * Renders different elements such as paragraphs, headings, lists, block quotes, and links.
 */
export const RenderElement = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: element.align };

  switch (element.type) {
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          className="text-button-text-text underline"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (!element.url) return;
            event.preventDefault();
            window.open(element.url, "_blank");
          }}
        >
          {children}
        </a>
      );
    case "block-quote":
      return (
        <blockquote {...attributes} style={style} className="border-l-2 border-gray-300 pl-2 text-gray-500 italic">
          {children}
        </blockquote>
      );
    case "numbered-list":
      return <ol {...attributes} style={style} className="list-decimal pl-5">{children}</ol>;
    case "bulleted-list":
      return <ul {...attributes} style={style} className="list-disc pl-5">{children}</ul>;
    case "list-item":
      return <li {...attributes} style={style}>{children}</li>;
    case "h1":
      return <h1 {...attributes} style={style} className="text-2xl font-bold">{children}</h1>;
    case "h2":
      return <h2 {...attributes} style={style} className="text-xl font-bold">{children}</h2>;
    default:
      return <p {...attributes} style={style} className="text-base">{children}</p>;
  }
};

/**
 * RichTextEditor Component
 * Provides a fully featured rich-text editor using Slate.js with history and React integrations.
 * Supports initial value parsing, custom key bindings, and a toolbar for formatting options.
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ name, locale, onChange, onLoseFocus, placeholder, initialValue }) {

    // Deserialize the initial value to Slate format
    const deserializedInitialValue = deserialize(initialValue);

    // Initialize the editor with history and React plugin
    const [editor] = useState(() => {
      const editor = withHistory(withReact(createEditor()));
      const { isInline } = editor;
      editor.isInline = (element) => (element.type === "link" ? true : isInline(element));
      return editor;
    });

    if (!deserializedInitialValue) return null;

    /**
     * Handles keyboard shortcuts for text formatting.
     */
    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
      const key = event.key.toLowerCase();
      if (event.ctrlKey || event.metaKey) {
        switch (key) {
          case "b":
            toggleMark(editor, "bold");
            event.preventDefault();
            break;
          case "i":
            toggleMark(editor, "italic");
            event.preventDefault();
            break;
          case "u":
            toggleMark(editor, "underline");
            event.preventDefault();
            break;
          case "z":
            editor.undo();
            event.preventDefault();
            break;
          case "y":
            editor.redo();
            event.preventDefault();
            break;
        }
      }
    };
    const handleBlur = () => {
      const serialized = serialize(editor.children);
      onLoseFocus(serialized);
    }
    return (
      <div className="text-text-primary w-full">
        <Slate editor={editor} initialValue={deserializedInitialValue} onChange={(value) => onChange(value)}>

          <div
            className="bg-black text-text-primary border-0 w-full  min-w-0 min-h-40  focus:outline-none overflow-y-auto"
            style={{ resize: "vertical" }}
          >
            <Toolbar locale={locale} />
            <div className="p-4 w-full">
              <Editable
                name={name}
                placeholder={placeholder}
                spellCheck
                renderLeaf={RenderLeaf}
                renderElement={RenderElement}
                onKeyDown={onKeyDown}
                className="focus:outline-none w-full"
                onBlur={handleBlur}
              />
            </div>
          </div>
        </Slate>
      </div>
    );
  }
);

export default RichTextEditor;