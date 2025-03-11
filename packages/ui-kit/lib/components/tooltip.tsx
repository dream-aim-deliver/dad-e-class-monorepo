import React, { useState, useRef } from 'react';
import { IconInfoCircle } from './icons/icon-infocircle';
import { cn } from '../utils/style-utils';
interface TooltipProps {
    text: string;
    content: string;
  }
/**
 * Tooltip Props Interface
 * @interface TooltipProps
 * @property {string} text - The text displayed alongside the info icon
 * @property {string} content - The content to display inside the tooltip
 */


/**
 * Tooltip Component
 * 
 * A lightweight, accessible tooltip component that provides additional
 * information when users hover over or focus on the element.
 * 
 * @component
 * @example
 * 
 * <Tooltip 
 *   text="Help" 
 *   content="This is additional information provided by the tooltip." 
 * />
 * 
 * @example
 * // With longer content
 * <Tooltip 
 *   text="Important information" 
 *   content="This tooltip contains a longer explanation that might span multiple lines." 
 * />
 */
function Tooltip({ text, content}: TooltipProps) {
  // State to control tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Ref for the tooltip element for potential DOM manipulation
  const tooltipRef = useRef<HTMLDivElement>(null);
      
  return (
    <div className="relative inline-block">
      {/* Tooltip trigger element */}
      <span
        className="inline-flex gap-1 items-center text-text-secondary text-sm leading-[150%] "
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        aria-describedby="tooltip-content"
        role="button"
      >
        {text}
        <IconInfoCircle fill='text-text-secondary' classNames={cn('w-3 h-3')} />
      </span>
      
      
      {showTooltip && (
        <div
          id="tooltip-content"
          ref={tooltipRef}
          className={`absolute z-10 bottom-6 -right-1 p-4 text-xs text-text-secondary leading-3.5 bg-tooltip-background border-tooltip-border rounded-lg shadow-lg opacity-100 transition-opacity duration-200 max-w-[240px]`}
          role="tooltip"
        >
          {content}
         
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent absolute -bottom-1.5 right-1 border-t-tooltip-background"></div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;