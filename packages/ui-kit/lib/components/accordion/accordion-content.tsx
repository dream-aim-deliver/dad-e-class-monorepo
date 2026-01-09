'use client'
import { forwardRef, ReactNode, useContext } from "react"
import { AccordionContext } from "./accordion"
import { cn } from "../../utils/style-utils"
/**
 * AccordionContent component
 *
 * This component represents the content of an accordion item. It utilizes the AccordionContext
 * to determine if the item should be expanded or collapsed. Uses CSS grid for smooth animation.
 *
 * Props:
 * - children: ReactNode - Content to be displayed inside the accordion.
 * - value: string - Unique value identifying the accordion item.
 * - className?: string - Additional CSS classes for customization.
 */
interface AccordionContentProps {
    children: ReactNode
    value: string
    className?: string
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(({ children, value, className }, ref) => {
        const context = useContext(AccordionContext)
        if (!context) throw new Error("AccordionContent must be used within Accordion")

        const isOpen = context.value.includes(value)

        return (
            <div
                ref={ref}
                className="grid w-full transition-all duration-100 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className={cn("overflow-hidden", className)}>
                    {children}
                </div>
            </div>
        )
    }
)

AccordionContent.displayName = "AccordionContent"

export default AccordionContent
