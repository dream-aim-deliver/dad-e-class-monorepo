import { forwardRef, ReactNode, useContext } from "react";
import { AccordionContext } from "./accordion";
import { IconChevronUp } from "../icons/icon-chevron-up";
import { IconTrashAlt } from "../icons/icon-trash-alt";
import { IconPlus } from "../icons/icon-plus";
import { IconMinus } from "../icons/icon-minus";
import { IconChevronDown } from "../icons/icon-chevron-down";
import { cn } from "../../utils/style-utils";
interface AccordionTriggerProps {
  children: ReactNode
  value: string
  className?: string,
  hasIcon?: boolean,
  placeholderIcon?: ReactNode,
  hasNumber?: boolean;
  number?: number;
  onUpClick?: (value: string) => void;
  onDownClick?: (value: string) => void;
  onDelete?: () => void;

}

const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({ children, value, className,hasNumber,number, hasIcon = "false",placeholderIcon, onUpClick, onDownClick, onDelete }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error("AccordionTrigger must be used within Accordion")



    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between w-full  text-left cursor-pointer",
          "text-white   transition-colors",
          className
        )}
        onClick={() => context.toggle(value)}
      >
        <div className="flex-1 flex gap-8">
          {hasNumber ? <h4 className="text-action-default">{number}</h4> : null}
          {hasIcon ? placeholderIcon : null}
          {children}
        </div>
        {<div className="flex items-center gap-4" >
          {context.variance == "second" ? <><button
            className="text-primary  p-2 rounded "
            onClick={(e) => {
              e.stopPropagation();
              onDelete()
            }}
          >
            <IconTrashAlt classNames='text-button-text-text' size={"6"} />
          </button>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onUpClick?.(value);
              }}>
              <IconChevronUp
                size={"6"}
                classNames="cursor-pointer text-button-text-text"


              />
            </span>
            <span onClick={(e) => {
              e.stopPropagation();
              onDownClick?.(value);
            }}>
              <IconChevronDown
                size={"6"}

                classNames="cursor-pointer text-button-text-text"
              />
            </span>
          </> :
            <> {!context.value.includes(value) ? (
              <IconPlus size={"8"} classNames='text-button-text-text ml-4' />
            ) : (
              <IconMinus size={"8"} classNames='text-button-text-text ml-4' />
            )}</>
          }
        </div>}
      </div>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"


export default AccordionTrigger