import { forwardRef, ReactNode } from "react"
import { cn } from "../../utils/style-utils"

interface AccordionItemProps {
    children: ReactNode
    value: string
    className?: string
  }
  
  const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ children, value, className }, ref) => {
  
      return (
        <div
          ref={ref}
          className={cn(
            "",
            className
          )}
          data-value={value}
        >
          {children}
        </div>
      )
    }
  )
  AccordionItem.displayName = "AccordionItem"
  

  export default AccordionItem