import React from "react";
import { ReactEditor, useSlate } from "slate-react";
import {
  HEADINGS,
  RichTextAction,
  TEXT_BLOCK_OPTIONS,
  TEXT_FORMAT_OPTIONS,
} from "../../../lib/utils/constants"

import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./slate"
import { EditorType, ElementKey, MarkKey } from "./types"
import { Dropdown } from "../dropdown";
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
    return isBlockActive(editor as EditorType, id as ElementKey) ? "bg-button-text-text text-white" : "text-text-secondary";
  };

  return (
    <div className="flex w-full rounded-tl-md rounded-tr-md text-text-primary  overflow-auto gap-4 bg-base-neutral-700 p-3">
      <div className="flex items-center space-x-2">
        <select
          className="px-4 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2"
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
        {TEXT_FORMAT_OPTIONS.map(({ id, label, icon }) => (
          <button
            key={id}
            aria-label={label}
            className={`p-2 rounded   text-black  ${getMarkSelectionClass(id)}`}
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
