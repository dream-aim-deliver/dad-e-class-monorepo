import { forwardRef, ReactNode, useContext } from "react";
import { AccordionContext } from "./accordion";
import { cn } from "../../utils/style-utils";
import { IconMinus, IconPlus } from "../icons";

/**
 * Icon component type for custom expand/collapse icons
 * Supports both component references and JSX elements
 */
export type AccordionIconComponent = React.ReactElement;

/**
 * AccordionTrigger Component
 *
 * This component serves as a trigger for toggling an accordion section.
 * It displays a clickable header with customizable icons for expanded/collapsed states.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {ReactNode} props.children - Content inside the accordion trigger
 * @param {string} props.value - The unique value associated with the accordion section
 * @param {string} [props.className] - Additional CSS classes for styling
 * @param {boolean} [props.showIcon] - Whether to show icons (default: true)
 * @param {string} [props.iconSize] - Size of the icon (default: "6")
 * @param {AccordionIconComponent} [props.expandIcon] - Custom icon for expanded state (default: IconChevronUp)
 * @param {AccordionIconComponent} [props.collapseIcon] - Custom icon for collapsed state (default: IconChevronDown)
 * @returns {JSX.Element | null} The rendered AccordionTrigger component
 */
interface AccordionTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
  showIcon?: boolean;
  expandIcon?: AccordionIconComponent;
  collapseIcon?: AccordionIconComponent;
}

const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({
    children,
    value,
    className,
    showIcon = true,
    expandIcon,
    collapseIcon
  }, ref) => {
    const context = useContext(AccordionContext);

    if (!context) {
      console.warn("AccordionTrigger must be used within an Accordion.");
      return null;
    }

    const isExpanded = context.value.includes(value);

    // Default icons if none provided
    const defaultExpandIcon = <IconMinus  classNames="text-button-text-text" />;
    const defaultCollapseIcon = <IconPlus  classNames="text-button-text-text" />;

    // Use provided icons or defaults
    const expandIconElement = expandIcon || defaultExpandIcon;
    const collapseIconElement = collapseIcon || defaultCollapseIcon;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between w-full text-left cursor-pointer",
          "text-text-primary transition-colors",
          className
        )}
        onClick={() => context.toggle(value)}
      >
        <div className="flex-1 flex">
          {children}
        </div>

        {showIcon && (
          <div className="flex items-center gap-4">
            {isExpanded ? expandIconElement : collapseIconElement}
          </div>
        )}
      </div>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
