import { useState, useRef, useEffect } from "react";
import { useSlate } from "slate-react";
import { Editor, Element } from "slate";
import {
  HEADINGS,
  TOOLBAR_ITEMS,
  ToolbarItem,
} from "../../utils/constants"

import { insertLink, isBlockActive, isLinkActive, isMarkActive, removeLink, toggleBlock, toggleMark, insertHorizontalRule } from "./slate"
import { EditorType, ElementKey, MarkKey } from "./types"
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconMoreHorizontal } from "../icons";

type SizeTier = 's' | 'm' | 'l' | 'xl';

const SIZE_TIERS: Record<SizeTier, { iconSize: number; btnClass: string; gapClass: string; padClass: string; itemWidth: number; toolbarPadding: number }> = {
  s:  { iconSize: 16, btnClass: 'p-0.5', gapClass: 'gap-1',   padClass: 'p-2',   itemWidth: 24, toolbarPadding: 16 },
  m:  { iconSize: 18, btnClass: 'p-1',   gapClass: 'gap-1.5', padClass: 'p-2',   itemWidth: 32, toolbarPadding: 16 },
  l:  { iconSize: 20, btnClass: 'p-1.5', gapClass: 'gap-2',   padClass: 'p-2.5', itemWidth: 40, toolbarPadding: 20 },
  xl: { iconSize: 20, btnClass: 'p-1.5', gapClass: 'gap-2',   padClass: 'p-3',   itemWidth: 40, toolbarPadding: 24 },
};

const DOTS_WIDTH = 28;
const DIVIDER_WIDTH = 9;

const getTier = (width: number): SizeTier => {
  if (width >= 700) return 'xl';
  if (width >= 550) return 'l';
  if (width >= 400) return 'm';
  return 's';
};

export default function Toolbar({ locale }: isLocalAware) {
  const editor = useSlate();
  const [showOverflow, setShowOverflow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [sizeTier, setSizeTier] = useState<SizeTier>('m');
  const overflowRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  // Close overflow on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(event.target as Node)) {
        setShowOverflow(false);
      }
    };
    if (showOverflow) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOverflow]);

  const dictionary = getDictionary(locale);
  const config = SIZE_TIERS[sizeTier];
  const allItems = TOOLBAR_ITEMS(dictionary, config.iconSize);
  const totalItems = allItems.length;

  // ResizeObserver to compute size tier and how many items fit
  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropdown = dropdownRef.current;
    if (!toolbar || !dropdown) return;

    const compute = () => {
      const containerWidth = toolbar.clientWidth;
      const tier = getTier(containerWidth);
      setSizeTier(tier);

      const { itemWidth, toolbarPadding } = SIZE_TIERS[tier];
      const dropdownWidth = dropdown.offsetWidth;
      const withoutDots = containerWidth - dropdownWidth - toolbarPadding;
      const withDots = withoutDots - DOTS_WIDTH - DIVIDER_WIDTH;

      if (Math.floor(withoutDots / itemWidth) >= totalItems) {
        setVisibleCount(totalItems);
      } else {
        setVisibleCount(Math.max(0, Math.floor(withDots / itemWidth)));
      }
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, [totalItems]);

  // Derive visible/overflow split
  const splitIndex = Math.min(visibleCount, totalItems);
  const visibleItems = allItems.slice(0, splitIndex);
  const overflowItems = allItems.slice(splitIndex);
  const hasOverflow = overflowItems.length > 0;

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

  const baseHoverClasses = "hover:bg-button-primary-hover-fill hover:text-white active:bg-button-primary-fill active:text-white active:scale-95 transform transition-all duration-150";

  const getItemClass = (item: ToolbarItem): string => {
    switch (item.kind) {
      case "mark":
        return isMarkActive(editor as EditorType, item.id as MarkKey)
          ? `bg-button-text-text text-white ${baseHoverClasses}`
          : `text-text-secondary ${baseHoverClasses}`;
      case "block":
      case "link":
      case "unlink":
        return isBlockActive(editor as EditorType, item.id as ElementKey)
          ? `bg-button-text-text text-text-primary ${baseHoverClasses}`
          : `text-text-secondary ${baseHoverClasses}`;
      case "action":
      default:
        return `text-text-secondary ${baseHoverClasses}`;
    }
  };

  const handleItemClick = (item: ToolbarItem) => {
    switch (item.kind) {
      case "action":
        if (item.id === "undo") editor.undo();
        else if (item.id === "redo") editor.redo();
        break;
      case "mark":
        toggleMark(editor as EditorType, item.id as MarkKey);
        break;
      case "block":
        if (item.id === "horizontal-rule") {
          insertHorizontalRule(editor as EditorType);
        } else {
          toggleBlock(editor as EditorType, item.id as ElementKey);
        }
        break;
      case "link": {
        const url = window.prompt("Enter URL:");
        if (url) insertLink(editor, url);
        break;
      }
      case "unlink":
        removeLink(editor);
        break;
    }
  };

  const renderButton = (item: ToolbarItem) => (
    <button
      key={item.id}
      type="button"
      title={item.label}
      aria-label={item.label}
      className={`${config.btnClass} rounded shrink-0 ${getItemClass(item)}`}
      onMouseDown={(e) => {
        e.preventDefault();
        handleItemClick(item);
      }}
      disabled={item.kind === "unlink" && !isLinkActive(editor)}
    >
      {item.icon}
    </button>
  );

  return (
    <div
      ref={toolbarRef}
      className={`z-10 flex items-center text-text-primary ${config.gapClass} bg-base-neutral-700 ${config.padClass} shadow-md w-full`}
    >
      <select
        ref={dropdownRef}
        className="px-3 py-1.5 text-sm border border-neutral-500 rounded-md focus:outline-none focus:ring-1 shrink-0"
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

      {visibleItems.map(renderButton)}

      {hasOverflow && (
        <>
          <div className="border-l border-gray-300 h-5 self-center shrink-0" />
          <div className="relative flex items-center shrink-0" ref={overflowRef}>
            <button
              type="button"
              className={`${config.btnClass} rounded hover:bg-base-neutral-600 text-text-primary`}
              onClick={() => setShowOverflow(!showOverflow)}
              title="More formatting options"
            >
              <IconMoreHorizontal size="4" />
            </button>
            {showOverflow && (
              <div className="absolute top-full right-0 mt-1 bg-base-neutral-700 rounded-medium shadow-lg border border-base-neutral-600 p-2 z-20 flex flex-wrap gap-1 min-w-[200px]">
                {overflowItems.map(renderButton)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
