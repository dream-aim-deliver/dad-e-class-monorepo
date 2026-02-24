import { Editor, Element, Transforms, Range } from "slate";
import { AlignKey, EditorType, ElementKey, MarkKey } from "./types";

/**
 * Checks if a specific mark (bold, italic, etc.) is active in the editor.
 * @param {EditorType} editor - The Slate editor instance.
 * @param {MarkKey} format - The mark format to check.
 * @returns {boolean} - True if the mark is active, false otherwise.
 */
export const isMarkActive = (editor: EditorType, format: MarkKey) => {
  return !!Editor.marks(editor)?.[format];
};

/**
 * Toggles a text formatting mark (bold, italic, etc.) on or off.
 * @param {EditorType} editor - The Slate editor instance.
 * @param {MarkKey} format - The mark format to toggle.
 */
export const toggleMark = (editor: EditorType, format: MarkKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) editor.removeMark(format);
  else editor.addMark(format, true);
};

/**
 * Determines if a format is an alignment format.
 * @param {ElementKey} format - The format to check.
 * @returns {boolean} - True if it is an alignment format, false otherwise.
 */
const isAlignFormat = (format: ElementKey) =>
  ["left", "center", "justify", "right"].includes(format);

/**
 * Determines if a format is a list format.
 * @param {ElementKey} format - The format to check.
 * @returns {boolean} - True if it is a list format, false otherwise.
 */
const isListFormat = (format: ElementKey) =>
  ["numbered-list", "bulleted-list", "unordered-list"].includes(format);

/**
 * Checks if a specific block format is active.
 * @param {EditorType} editor - The Slate editor instance.
 * @param {ElementKey} format - The block format to check.
 * @returns {boolean} - True if the block format is active, false otherwise.
 */
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

/**
 * Toggles a block format such as paragraph, heading, list, or alignment.
 * @param {EditorType} editor - The Slate editor instance.
 * @param {ElementKey} format - The block format to toggle.
 */
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

  const newProperties: Partial<Element> = {};
  if (isAlign) newProperties["align"] = align;
  if (type) newProperties["type"] = type;

  Transforms.setNodes<Editor>(editor, newProperties);
};

/**
 * Checks if a link is active in the current selection.
 * @param {EditorType} editor - The Slate editor instance.
 * @returns {boolean} - True if a link is active, false otherwise.
 */
export const isLinkActive = (editor: EditorType) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
  return !!match;
};

/**
 * Gets the URL of the link at the current selection, if any.
 * @param {EditorType} editor - The Slate editor instance.
 * @returns {string | null} - The URL of the active link, or null if no link is active.
 */
export const getLinkUrl = (editor: EditorType): string | null => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
  if (match) {
    const [node] = match;
    if (Element.isElement(node) && 'url' in node) {
      return (node as { url: string }).url;
    }
  }
  return null;
};

/**
 * Inserts a link at the current selection or wraps the selected text in a link.
 * @param {EditorType} editor - The Slate editor instance.
 * @param {string} url - The URL to insert.
 */
export const insertLink = (editor: EditorType, url: string) => {
  if (!url) return;
  const { selection } = editor;
  if (!selection) return;

  // If already inside a link, update its URL
  if (isLinkActive(editor)) {
    Transforms.setNodes(
      editor,
      { url },
      { match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link" }
    );
    return;
  }

  const isCollapsed = Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

/**
 * Removes a link from the current selection.
 * @param {EditorType} editor - The Slate editor instance.
 */
export const removeLink = (editor: EditorType) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
};

/**
 * Inserts a horizontal rule at the current selection.
 * @param {EditorType} editor - The Slate editor instance.
 */
export const insertHorizontalRule = (editor: EditorType) => {
  const horizontalRule = {
    type: "horizontal-rule",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, horizontalRule);
  // Insert a new paragraph after the horizontal rule so the user can continue typing
  const paragraph = {
    type: "paragraph",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, paragraph);
};
