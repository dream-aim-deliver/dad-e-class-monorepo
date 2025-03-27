import { forwardRef, ReactNode, useContext } from "react";
import { AccordionContext } from "./accordion";
import { IconChevronUp } from "../icons/icon-chevron-up";
import { IconTrashAlt } from "../icons/icon-trash-alt";
import { IconPlus } from "../icons/icon-plus";
import { IconMinus } from "../icons/icon-minus";
import { IconChevronDown } from "../icons/icon-chevron-down";
import { cn } from "../../utils/style-utils";

/**
 * AccordionTrigger Component
 * 
 * This component serves as a trigger for toggling an accordion section.
 * It displays a clickable header with an optional numbering system and an icon
 * that indicates whether the section is expanded or collapsed.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {ReactNode} props.children - Content inside the accordion trigger
 * @param {string} props.value - The unique value associated with the accordion section
 * @param {string} [props.className] - Additional CSS classes for styling
 * @param {boolean} [props.hasNumber=false] - Whether to display a number before the title
 * @param {number} [props.number] - The number to display if hasNumber is true
 * 
 * @returns {JSX.Element | null} The rendered AccordionTrigger component
 */
interface AccordionTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
  hasNumber?: boolean;
  number?: number;
}

const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({ children, value, className, hasNumber = false, number }, ref) => {
    const context = useContext(AccordionContext);
    
    if (!context) {
      console.warn("AccordionTrigger must be used within an Accordion.");
      return null;
    }

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
        <div className="flex-1 flex gap-8 items-center">
          {hasNumber && number !== undefined && <h4 className="text-action-default">{number}.</h4>}
          {children}
        </div>
        <div className="flex items-center gap-4">
          {!context.value.includes(value) ? (
            <IconPlus size="8" classNames="text-button-text-text ml-4" />
          ) : (
            <IconMinus size="8" classNames="text-button-text-text ml-4" />
          )}
        </div>
      </div>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;