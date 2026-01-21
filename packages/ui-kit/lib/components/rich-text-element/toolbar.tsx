import { useSlate } from "slate-react";
import { Editor, Element } from "slate";
import {
  HEADINGS,
  RichTextAction,
  TEXT_ACTION_OPTIONS,
  TEXT_BLOCK_OPTIONS,
  TEXT_FORMAT_OPTIONS,
} from "../../utils/constants"

import { insertLink, isBlockActive, isLinkActive, isMarkActive, removeLink, toggleBlock, toggleMark, insertHorizontalRule } from "./slate"
import { EditorType, ElementKey, MarkKey } from "./types"
import { Link, Unlink } from "lucide-react";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

export default function Toolbar({ locale }: isLocalAware) {
  const editor = useSlate();

  // Get the current block type from the editor selection
  const getCurrentBlockType = (): string => {
    const { selection } = editor;
    if (!selection) return "paragraph";

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (node) => !Editor.isEditor(node) && Element.isElement(node) && node.type !== undefined,
      })
    );

    if (match && Element.isElement(match[0])) {
      return match[0].type || "paragraph";
    }

    return "paragraph";
  };

  const currentBlockType = getCurrentBlockType();

  const onMarkClick = (id: RichTextAction) => {
    toggleMark(editor as EditorType, id as MarkKey);
  };

  const getMarkSelectionClass = (id: RichTextAction) => {
    const baseClasses = "hover:bg-button-primary-hover-fill hover:text-white active:bg-button-primary-fill active:text-white active:scale-95 transform transition-all duration-150";
    return isMarkActive(editor as EditorType, id as MarkKey) ? `bg-button-text-text text-white ${baseClasses}` : `text-text-secondary ${baseClasses}`;
  };

  const onBlockClick = (id: RichTextAction) => {
    // Handle horizontal rule differently since it's an insertion, not a toggle
    if (id === "horizontal-rule") {
      insertHorizontalRule(editor as EditorType);
    } else {
      toggleBlock(editor as EditorType, id as ElementKey);
    }
  };

  const getBlockSelectionClass = (id: RichTextAction) => {
    const baseClasses = "hover:bg-button-primary-hover-fill hover:text-white active:bg-button-primary-fill active:text-white active:scale-95 transform transition-all duration-150";
    return isBlockActive(editor as EditorType, id as ElementKey) ? `bg-button-text-text text-text-primary ${baseClasses}` : `text-text-secondary ${baseClasses}`;
  };

  const handleAction = (action: string) => {
    if (action === "undo") {
      editor.undo();
    } else if (action === "redo") {
      editor.redo();
    }
  };

  const getActionSelectionClass = () => {
    // For visual feedback, we can check if the action is available
    // Slate editors typically have history, but we'll use a simple pressed effect
    return "text-text-secondary hover:bg-button-primary-hover-fill hover:text-white active:bg-button-primary-fill active:text-white active:scale-95 transform transition-all duration-150";
  };
  const handleInsertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      insertLink(editor, url);
    }
  };
  const dictionary = getDictionary(locale);
  return (
    <div className="sticky top-0 z-10 min-h-14 flex flex-nowrap text-text-primary overflow-x-auto gap-4 bg-base-neutral-700 p-3 shadow-md w-full">
      <div className="flex items-center space-x-2">
        <select
          className="px-4 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-1"
          value={currentBlockType}
          onChange={(e) => toggleBlock(editor as EditorType, e.target.value as ElementKey)}
        >
          <option value="paragraph">{dictionary.components.richTextToolbar.paragraph}</option>
          {HEADINGS.map((heading) => (
            <option key={heading} value={heading}>
              {heading}
            </option>
          ))}
        </select>
        <div className="flex items-center space-x-4 text-text-secondary">
          {TEXT_ACTION_OPTIONS(dictionary).map((option) => (
            <button
              type="button"
              key={option.id}
              title={`${option.label}`}
              className={`p-2 rounded ${getActionSelectionClass()}`}
              onClick={() => handleAction(option.id)}>
              {option.icon}
            </button>
          ))}
          <button
            type="button"
            title={dictionary.components.richTextToolbar.link}
            className={`p-2 rounded   text-text-primary ${getBlockSelectionClass("link" as RichTextAction)}`}
            onClick={handleInsertLink}>
            <Link size={24} />
          </button>
          <button
            type="button"
            title={dictionary.components.richTextToolbar.unlink}
            className={`p-2 rounded   text-text-primary ${getBlockSelectionClass("unlink" as RichTextAction)} `}
            onClick={() => removeLink(editor)} disabled={!isLinkActive(editor)}>
            <Unlink size={24} />
          </button>
        </div>
        {TEXT_FORMAT_OPTIONS(dictionary).map(({ id, label, icon }) => (
          <button
            type="button"
            title={label}
            key={id}
            aria-label={label}
            className={`p-2 rounded   text-text-primary ${getMarkSelectionClass(id)}`}
            onMouseDown={(e) => {
              e.preventDefault();
              onMarkClick(id);
            }}
          >
            {icon}
          </button>
        ))}
      </div>
      <div className="border-l border-gray-300 h-6 self-center" />
      <div className="flex   items-center space-x-2">
        {TEXT_BLOCK_OPTIONS(dictionary).map(({ id, label, icon }) => (
          <button
            type="button"
            title={label}
            key={id}
            aria-label={label}
            className={`p-2 rounded  ${getBlockSelectionClass(id)}`}
            onMouseDown={(e) => {
              e.preventDefault();
              onBlockClick(id);
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
