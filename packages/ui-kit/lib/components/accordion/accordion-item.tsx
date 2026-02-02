import { forwardRef, ReactNode } from "react";
import { cn } from "../../utils/style-utils";

/**
 * AccordionItem component
 *
 * A wrapper component for individual accordion items. It accepts children,
 * a unique value for identification, and an optional className for styling.
 *
 * @component
 * @param {AccordionItemProps} props - The props for the AccordionItem component.
 * @param {ReactNode} props.children - The content inside the accordion item.
 * @param {string} props.value - A unique identifier for the accordion item.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the accordion item container.
 * @returns {JSX.Element} The rendered AccordionItem component.
 */
interface AccordionItemProps {
  children: ReactNode;
  value: string;
  className?: string;
  id?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, className, id }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className={cn("", className)}
        data-value={value}
      >
        {children}
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export default AccordionItem;