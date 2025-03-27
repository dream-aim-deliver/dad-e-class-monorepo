import { useState, createContext, forwardRef, ReactNode } from "react";
import { cn } from "../../utils/style-utils";
/**
 * Accordion Components Export
 * 
 * This module exports all the components required to create an accordion UI.
 * It includes:
 * - `Accordion`: The wrapper component that manages the state of the accordion.
 * - `AccordionItem`: Represents an individual collapsible item within the accordion.
 * - `AccordionTrigger`: The button or element used to toggle the visibility of the item's content.
 * - `AccordionContent`: The collapsible content that gets shown or hidden based on the trigger interaction.
 *
 * These components are designed to work together for creating accessible and customizable accordion structures.
 */

/**
 * Accordion Context Type
 * 
 * Defines the structure for the accordion's context, managing state and toggle behavior.
 */
type AccordionContextType = {
    value: string[],
    toggle: (value: string) => void,
    variance?: string
};

/**
 * Context provider for accordion components to share state.
 */
export const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

/**
 * Accordion Component Props
 * 
 * - `variance`: Specifies the visual style of the accordion.
 * - `children`: Nested accordion items.
 * - `type`: Determines if the accordion supports single or multiple expanded items.
 * - `className`: Custom styles for the accordion wrapper.
 * - `defaultValue`: Default expanded items.
 */
interface AccordionProps {
    variance?: string,
    children: ReactNode,
    type?: "single" | "multiple",
    className?: string,
    defaultValue?: string[]
}

/**
 * Accordion Component
 * 
 * This component serves as the main wrapper for the accordion functionality.
 * It manages state using context and controls item expansion.
 */
const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
    (
        {
           variance = "first",
            children,
            type = "single",
            className,
            defaultValue = [],
        }: AccordionProps,
        ref
    ) => {

        const [value, setValue] = useState<string[]>(defaultValue);

        /**
         * Toggle function to handle accordion item expansion and collapse.
         */
        const toggle = (itemValue: string) => {
            if (type === "single") {
                setValue(value.includes(itemValue) ? [] : [itemValue]);
            } else {
                setValue(
                    value.includes(itemValue)
                        ? value.filter((v) => v !== itemValue)
                        : [...value, itemValue]
                );
            }
        };

        return (
            <AccordionContext.Provider
                value={{ value, toggle, variance }}
            >
                <div ref={ref} className={cn("w-full space-y-1", className)}>
                    {children}
                </div>
            </AccordionContext.Provider>
        );
    }
);

export default Accordion;


