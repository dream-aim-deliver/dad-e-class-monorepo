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
 * @returns {JSX.Element | null} The rendered AccordionTrigger component
 */
interface AccordionTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
}

const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({ children, value, className }, ref) => {
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
        <div className="flex-1 flex">
          {children}
          </div>
       
        <div className="flex items-center gap-4">
          {!context.value.includes(value) ? (
            <IconPlus size="6" classNames="text-button-text-text ml-4" />
          ) : (
            <IconMinus size="6" classNames="text-button-text-text ml-4" />
          )}
        </div>
      </div>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;