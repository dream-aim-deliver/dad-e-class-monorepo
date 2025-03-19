import React, { useState, useRef, useEffect } from 'react';
import { IconInfoCircle } from './icons/icon-infocircle';
import { cn } from '../utils/style-utils';

interface TooltipProps {
  text: string;
  title?: string;
  description: string;
}
/**
 * A reusable Tooltip component that provides additional information when a user hovers over or focuses on the trigger element.
 * The tooltip dynamically adjusts its position to prevent it from being cut off by the viewport.
 *
 * @param text The text displayed alongside the info icon.
 * @param title Optional title displayed inside the tooltip.
 * @param description The main content of the tooltip.
 *
 * @state showTooltip Controls the visibility of the tooltip.
 * @state position Determines whether the tooltip appears above (`up`) or below (`down`) the trigger element.
 *
 * @ref tooltipRef Reference to the tooltip element.
 * @ref triggerRef Reference to the element that triggers the tooltip.
 *
 * @behavior
 * - Displays the tooltip when the user hovers or focuses on the trigger element.
 * - Uses `Element.getBoundingClientRect()` to check if the tooltip is cut off.
 * - Adjusts tooltip position dynamically:
 *   - Moves **downward** if it overflows the top.
 *   - Moves **upward** if it overflows the bottom.
 * - Includes an arrow (`<div>`) to visually connect the tooltip with the trigger element.
 *
 * @example
 * <Tooltip 
 *   text="More Info" 
 *   title="Important Notice" 
 *   description="This tooltip provides extra details about this feature." 
 * />
 */



function Tooltip({ text, title, description }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState<'up' | 'down'>('up');

  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showTooltip && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (tooltipRect.top < 0) {
        setPosition('down');
      } else if (tooltipRect.bottom > viewportHeight) {
        setPosition('up');
      } else {
        setPosition('up');
      }
    }
  }, [showTooltip]);

  return (
    <div className="relative inline-block">
      {/* Tooltip trigger element */}
      <div
        ref={triggerRef}
        className="inline-flex gap-1 items-center text-sm leading-[150%] cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        aria-describedby="tooltip-content"
        role="button"
      >
        <span className="line-clamp-2 text-text-secondary">{text}</span>
        <IconInfoCircle size="4" classNames={cn('flex-shrink-0 text-text-secondary hover:text-text-primary')} />
      </div>

      {showTooltip && (
        <div
          id="tooltip-content"
          ref={tooltipRef}
          className={cn(
            'absolute z-10 p-4 text-xs text-text-secondary leading-[150%] bg-tooltip-background border-tooltip-border rounded-lg shadow-lg opacity-100 transition-opacity duration-200 max-w-[240px]',
            position === 'up' ? 'bottom-6 -right-1' : 'top-6 -right-1'
          )}
          role="tooltip"
        >
          <span className="font-important text-sm text-text-primary">{title}</span>
          <p className="text-sm font-normal text-text-secondary">{description}</p>

          {/* Tooltip arrow */}
          <div
            className={cn(
              'w-0 h-0 border-l-8 border-r-8  border-transparent absolute',
              position === 'up'
                ? '-bottom-1.5 right-1 border-t-8 border-t-tooltip-background'
                : '-top-1.5 right-1 border-b-8 border-b-tooltip-background'
            )}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
