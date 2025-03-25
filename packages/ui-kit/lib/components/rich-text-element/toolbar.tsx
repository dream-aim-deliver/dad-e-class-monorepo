import React from "react";
import { ReactEditor, useSlate } from "slate-react";
import {
  HEADINGS,
  RichTextAction,
  TEXT_ACTION_OPTIONS,
  TEXT_BLOCK_OPTIONS,
  TEXT_FORMAT_OPTIONS,
} from "../../utils/constants"

import { insertLink, isBlockActive, isLinkActive, isMarkActive, removeLink, toggleBlock, toggleMark } from "./slate"
import { EditorType, ElementKey, MarkKey } from "./types"
import { Link, Unlink } from "lucide-react";
export default function Toolbar() {
  const editor = useSlate();

  const onMarkClick = (id: RichTextAction) => {
    toggleMark(editor as EditorType, id as MarkKey);
  };

  const getMarkSelectionClass = (id: RichTextAction) => {
    return isMarkActive(editor as EditorType, id as MarkKey) ? "bg-button-text-text text-white" : "text-text-secondary";
  };

  const onBlockClick = (id: RichTextAction) => {
    toggleBlock(editor as EditorType, id as ElementKey);
  };

  const getBlockSelectionClass = (id: RichTextAction) => {
    return isBlockActive(editor as EditorType, id as ElementKey) ? "bg-button-text-text text-text-primary" : "text-text-secondary";
  };

  const handleAction = (action: string) => {
    if (action === "undo") {
      editor.undo();
    } else if (action === "redo") {
      editor.redo();
    }
  };
  const handleInsertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      insertLink(editor, url);
    }
  };
  return (
    <div className="rounded-tl-md min-h-14  flex flex-nowrap rounded-tr-md text-text-primary  overflow-x-auto gap-4 bg-base-neutral-700 p-3">
      <div className="flex items-center space-x-2">
        <select
          className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1"
          defaultValue="paragraph"
          onChange={(e) => toggleBlock(editor as EditorType, e.target.value as ElementKey)}
        >
          <option value="paragraph">Paragraph</option>
          {HEADINGS.map((heading) => (
            <option key={heading} value={heading}>
              {heading}
            </option>
          ))}
        </select>
        <div className="flex items-center space-x-4 text-text-secondary">
          {TEXT_ACTION_OPTIONS.map((option) => (
            <button
              key={option.id}
              title={`${option.label}`}
              onClick={() => handleAction(option.id)}>
              {option.icon}
            </button>
          ))}
            <button
            title="Insert Link"
            className={`p-2 rounded   text-text-primary ${getBlockSelectionClass("link" as RichTextAction)}`}
            onClick={handleInsertLink}>
            <Link size={24} />
          </button>
          <button
            title="Remove Link"
            className={`p-2 rounded   text-text-primary ${getBlockSelectionClass("unlink" as RichTextAction)} `}
            onClick={() => removeLink(editor)} disabled={!isLinkActive(editor)}>
            <Unlink size={24} />
          </button>
        </div>
        {TEXT_FORMAT_OPTIONS.map(({ id, label, icon }) => (
          <button
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
        {TEXT_BLOCK_OPTIONS.map(({ id, label, icon }) => (
          <button
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
