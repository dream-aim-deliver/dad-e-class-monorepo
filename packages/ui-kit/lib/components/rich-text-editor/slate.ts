import { Editor, Element, Transforms } from "slate";
import { AlignKey, EditorType, ElementKey, MarkKey } from "./types"

export const isMarkActive = (editor: EditorType, format: MarkKey) => {
  return !!Editor.marks(editor)?.[format];
};

export const toggleMark = (editor: EditorType, format: MarkKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) editor.removeMark(format);
  else editor.addMark(format, true);
};

const isAlignFormat = (format: ElementKey) =>
  ["left", "center", "justify", "right"].includes(format);

const isListFormat = (format: ElementKey) =>
  ["numbered-list", "bulleted-list"].includes(format);

export const isBlockActive = (editor: EditorType, format: ElementKey) => {
  const { selection } = editor;
  if (!selection) return false;

  const isAlign = isAlignFormat(format);
  const blockType = isAlign ? "align" : "type";

  const match = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) => {
        return (
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          node[blockType] === format
        );
      },
    })
  );

  return !!match?.[0];
};

export const toggleBlock = (editor: EditorType, format: ElementKey) => {
  const isAlign = isAlignFormat(format);
  const isList = isListFormat(format);
  const isActive = isBlockActive(editor, format);

  let align: AlignKey | undefined;
  let type: string | undefined;

  if (isAlign) {
    align = isActive ? undefined : (format as AlignKey);
  } else {
    type = isActive ? "paragraph" : format;
  }

  Transforms.unwrapNodes(editor, {
    match: (node) => {
      return (
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        isListFormat(node.type as ElementKey) &&
        !isAlignFormat(format)
      );
    },
  });

  if (!isActive && isList) {
    type = "list-item";
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  let newProperties: Partial<Element> = {};
  if (isAlign) newProperties["align"] = align;
  if (type) newProperties["type"] = type;

  Transforms.setNodes<Editor>(editor, newProperties);
};