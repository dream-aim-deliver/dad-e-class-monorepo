import React, { useState, useRef, useEffect } from 'react';
import { IconInfoCircle } from './icons/icon-infocircle';
import { cn } from '../utils/style-utils';

interface TooltipProps {
  text: string;
  title?: string;
  description: string;
  contentClassName?: string;
  tipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

/**
 * A reusable Tooltip component that provides additional information when a user hovers over or focuses on the trigger element.
 * This version prefers to show the tooltip above the element unless there's not enough space.
 *
 * @param text The text displayed alongside the info icon.
 * @param title Optional title displayed inside the tooltip.
 * @param description The main content of the tooltip.
 * @param contentClassName Optional className for styling the tooltip content.
 * @param tipPosition Position of the tooltip or 'auto' to detect best position (default: 'auto').
 */
function Tooltip({ 
  text, 
  title, 
  description, 
  contentClassName, 
  tipPosition = 'auto' 
}: TooltipProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>(
    tipPosition === 'auto' ? 'top' : tipPosition
  );
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle hover state
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  // Map positions to appropriate classes
  const positionClasses = {
    top: 'bottom-full left-0 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  // Map positions to arrow classes
  const arrowClasses = {
    top: 'bottom-[-5px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-b-0 border-l-transparent border-r-transparent border-t-tooltip-background',
    bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-t-0 border-l-transparent border-r-transparent border-b-tooltip-background',
    left: 'right-[-5px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-r-0 border-t-transparent border-b-transparent border-l-tooltip-background',
    right: 'left-[-5px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-l-0 border-t-transparent border-b-transparent border-r-tooltip-background'
  };

  // Calculate best position if set to auto, preferring top position when possible
  useEffect(() => {
    if ((isVisible || isFocused) && tipPosition === 'auto' && tooltipRef.current && triggerRef.current) {
      const updatePosition = () => {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Default to top position (above the element)
        let bestPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
        
        // Get tooltip dimensions
        const tooltipHeight = tooltipRect.height;
        
        // Check if there's enough space on top (preferred position)
        const spaceTop = triggerRect.top;
        const minRequiredSpace = tooltipHeight + 10; // Adding 10px buffer
        
        // Only change from top position if there's not enough space
        if (spaceTop < minRequiredSpace) {
          // Check space at bottom
          const spaceBottom = viewportHeight - triggerRect.bottom;
          
          if (spaceBottom >= minRequiredSpace) {
            bestPosition = 'bottom';
          } else {
            // If neither top nor bottom has enough space, try left or right
            const viewportWidth = window.innerWidth;
            const tooltipWidth = tooltipRect.width;
            const spaceLeft = triggerRect.left;
            const spaceRight = viewportWidth - triggerRect.right;
            
            if (spaceLeft >= tooltipWidth + 10 && spaceLeft > spaceRight) {
              bestPosition = 'left';
            } else if (spaceRight >= tooltipWidth + 10) {
              bestPosition = 'right';
            }
            // If no good position is found, keep the default 'top'
          }
        }
        
        setPosition(bestPosition);
      };
      
      // Calculate position after a short delay to ensure DOM is updated
      const timer = setTimeout(updatePosition, 10);
      
      // Recalculate on resize
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, isFocused, tipPosition]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip trigger element */}
      <div
        ref={triggerRef}
        className="inline-flex relative gap-1 items-center text-sm leading-[150%] cursor-pointer"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        aria-describedby="tooltip-content"
        role="button"
      >
        <span className="line-clamp-2 text-text-secondary">{text}</span>
        <IconInfoCircle size="4" classNames={cn('flex-shrink-0 text-text-secondary hover:text-text-primary')} />
      
      </div>
 {/* Tooltip content */}
 {(isVisible || isFocused) && (
        <div
          id="tooltip-content"
          ref={tooltipRef}
          className={cn(
            'absolute z-10 p-4 w-64 max-w-xs text-xs rounded-lg shadow-lg',
            'bg-tooltip-background border border-tooltip-border',
            'transition-opacity duration-200',
            tipPosition !== 'auto' ? positionClasses[tipPosition] : positionClasses[position],
            contentClassName
          )}
          role="tooltip"
        >
          {title && <span className="block font-important text-sm text-text-primary mb-1">{title}</span>}
          <p className="text-sm font-normal text-text-secondary">{description}</p>

          {/* Tooltip arrow */}
          <div 
            className={cn(
              'absolute w-0 h-0', 
              tipPosition !== 'auto' ? arrowClasses[tipPosition] : arrowClasses[position]
            )} 
          />
        </div>
      )}
     
    </div>
  );
}

export default Tooltip;