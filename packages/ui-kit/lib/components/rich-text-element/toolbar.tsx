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
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

export default function Toolbar ({locale}:isLocalAware) {
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
  const dictionary = getDictionary(locale);
  console.log(dictionary)
  return (
    <div className=" min-h-14  flex flex-nowrap  text-text-primary  overflow-x-auto gap-4 bg-base-neutral-700 p-3">
      <div className="flex items-center space-x-2">
        <select
          className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1"
          defaultValue={dictionary.components.richTextToolbar.paragraph}
          onChange={(e) => toggleBlock(editor as EditorType, e.target.value as ElementKey)}
        >
          <option value={dictionary.components.richTextToolbar.paragraph}>{dictionary.components.richTextToolbar.paragraph}</option>
          {HEADINGS.map((heading) => (
            <option key={heading} value={heading}>
              {heading}
            </option>
          ))}
        </select>
        <div className="flex items-center space-x-4 text-text-secondary">
          {TEXT_ACTION_OPTIONS(dictionary).map((option) => (
            <button
              key={option.id}
              title={`${option.label}`}
              onClick={() => handleAction(option.id)}>
              {option.icon}
            </button>
          ))}
            <button
            title={dictionary.components.richTextToolbar.link}
            className={`p-2 rounded   text-text-primary ${getBlockSelectionClass("link" as RichTextAction)}`}
            onClick={handleInsertLink}>
            <Link size={24} />
          </button>
          <button
            title={dictionary.components.richTextToolbar.unlink}
            className={`p-2 rounded   text-text-primary ${getBlockSelectionClass("unlink" as RichTextAction)} `}
            onClick={() => removeLink(editor)} disabled={!isLinkActive(editor)}>
            <Unlink size={24} />
          </button>
        </div>
        {TEXT_FORMAT_OPTIONS(dictionary).map(({ id, label, icon }) => (
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
        {TEXT_BLOCK_OPTIONS(dictionary).map(({ id, label, icon }) => (
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
