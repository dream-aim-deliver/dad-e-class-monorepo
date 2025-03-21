import { useState, createContext, forwardRef, ReactNode } from "react";
import { cn } from "../../utils/style-utils";

type AccordionContextType = {
    value: string[]
    toggle: (value: string) => void
    variance?: string
  }

  export const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

  interface AccordionProps {
    variance?: string,
    children: ReactNode
    type?: "single" | "multiple"
    className?: string
    defaultValue?: string[]
  }

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
          <div ref={ref} className={cn("w-full space-y-1 ", className)}>
            {children}
          </div>
        </AccordionContext.Provider>
      );
    }
  );
  

  export default Accordion;