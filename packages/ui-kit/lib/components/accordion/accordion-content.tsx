import { forwardRef, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { AccordionContext } from "./accordion"
import { cn } from "../../utils/style-utils"
/**
 * AccordionContent component
 * 
 * This component represents the content of an accordion item. It utilizes the AccordionContext
 * to determine if the item should be expanded or collapsed. The height of the content
 * is dynamically adjusted based on its visibility.
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
        const [height, setHeight] = useState<number>(0)
        const contentRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            const updateHeight = () => {
                if (contentRef.current) {
                    const newHeight = isOpen ? contentRef.current.scrollHeight : 0
                    setHeight(newHeight)
                }
            }

            updateHeight()

            const resizeObserver = new ResizeObserver(updateHeight)
            if (contentRef.current) {
                resizeObserver.observe(contentRef.current)
            }

            return () => {
                resizeObserver.disconnect()
            }
        }, [isOpen])

        return (
            <div
                ref={ref}
                className="overflow-hidden w-full h-auto transition-all duration-100 ease-in-out"
                style={{ height }}
            >
                <div ref={contentRef} className={cn("", className)}>
                    {children}
                </div>
            </div>
        )
    }
)

AccordionContent.displayName = "AccordionContent"

export default AccordionContent
