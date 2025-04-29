import React from "react";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations"
import { IconTrashAlt } from "../icons/icon-trash-alt"
import { IconButton } from "../icon-button"
import { IconChevronUp } from "../icons/icon-chevron-up"
import { IconChevronDown } from "../icons/icon-chevron-down"
/**
 * Designer Layout Component
 * This component provides the layout structure for the form designer interface.
 * It handles the arrangement and styling of form elements in the designer view.
 * 
 * Features:
 * - Responsive layout
 * - Form element arrangement
 * - Designer-specific styling
 * - Component organization
 * 
 * @example
 * ```tsx
 * <DesignerLayout>
 *   <FormElement />
 *   <FormElement />
 * </DesignerLayout>
 * ```
 */
interface DesignerLayoutProps extends isLocalAware {
    title: string,
    icon: React.ReactNode,
    onUpClick: () => void,
    onDownClick: () => void,
    onDeleteClick: () => void,
    courseBuilder: boolean,
    children: React.ReactNode,
}

/**
 * Designer Layout Component
 * Renders the layout structure for the form designer interface
 * 
 * @param title - The title of the form
 * @param icon - The icon to be displayed in the header
 * @param onUpClick - The function to be called when the "Move Up" button is clicked
 * @param onDownClick - The function to be called when the "Move Down" button is clicked
 * @param onDeleteClick - The function to be called when the "Delete" button is clicked
 * @param locale - The locale for translation
 * @param children - The form elements to be displayed in the layout
 */
const DesignerLayout = ({ title, icon, onUpClick, onDownClick, onDeleteClick, locale, children }: DesignerLayoutProps) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="p-4 w-full flex flex-col gap-4">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-4">
                {/* Title and Icon */}
                <div className="flex items-center gap-2 flex-1">
                    {icon}
                    <p className="text-md font-important leading-[24px]">{title}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <IconButton
                        icon={<IconTrashAlt />}
                        onClick={onDeleteClick}
                        size="medium"
                        title={dictionary.components.formBuilder.delete}
                    />
                    <IconButton
                        icon={<IconChevronUp />}
                        onClick={onUpClick}
                        size="medium"
                        title={dictionary.components.formBuilder.moveUp}
                    />
                    <IconButton
                        icon={<IconChevronDown />}
                        onClick={onDownClick}
                        size="medium"
                        title={dictionary.components.formBuilder.moveDown}
                    />
                </div>
            </div>

            {/* Divider */}
            <hr className="border-base-neutral-600" />

            {/* Content */}
            <div>
                {children}
            </div>
        </div>
    )
}

export default DesignerLayout;