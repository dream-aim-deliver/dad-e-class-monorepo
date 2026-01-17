import React from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconTrashAlt } from './icons/icon-trash-alt';
import { IconButton } from './icon-button';
import { IconChevronUp } from './icons/icon-chevron-up';
import { IconChevronDown } from './icons/icon-chevron-down';
import { AnimatedRadioButton } from './animated-radio-button';
import DefaultError from './default-error';

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
    title: string;
    type: string;
    icon: React.ReactNode;
    isChecked?: boolean;
    onUpClick: () => void;
    onDownClick: () => void;
    onDeleteClick: () => void;
    onChange?: (value: string) => void;
    courseBuilder: boolean;
    children: React.ReactNode;
    validationError?: string;
}

/**
 * Designer Layout Component
 * Renders the layout structure for the form designer interface
 *
 * @param title - The title of the form
 * @param icon - The icon to be displayed in the header
 * @param isChecked - Whether the radio button is checked
 * @param onUpClick - The function to be called when the "Move Up" button is clicked
 * @param onDownClick - The function to be called when the "Move Down" button is clicked
 * @param onDeleteClick - The function to be called when the "Delete" button is clicked
 * @param onChange - Callback when the radio button state changes
 * @param locale - The locale for translation
 * @param children - The form elements to be displayed in the layout
 */
const DesignerLayout = ({
    type,
    title,
    icon,
    isChecked = false,
    onChange,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
    children,
    courseBuilder = false,
    validationError,
}: DesignerLayoutProps) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="p-4 w-full flex flex-col gap-2 bg-base-neutral-800 rounded-md border-1 border-base-neutral-700">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-4 overflow-x-auto">
                {/* Title and Icon */}
                <div className="flex items-center gap-2 flex-1 text-text-primary">
                    <span className="min-w-0 flex-shrink-0">{icon}</span>
                    <p className="text-md font-important leading-[24px] word-break">
                        {title}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    {type != 'richText' &&
                        type !== 'headingText' &&
                        !courseBuilder && (
                            <div className="mr-4 flex items-center">
                                <AnimatedRadioButton
                                    name="required"
                                    value="required"
                                    checked={isChecked}
                                    size="small"
                                    onChange={onChange}
                                    withText={true}
                                    labelClass="text-text-primary capitalize"
                                    label={
                                        dictionary.components.formRenderer
                                            .requiredText
                                    }
                                />
                            </div>
                        )}
                    <IconButton
                        icon={<IconTrashAlt />}
                        onClick={onDeleteClick}
                        size="medium"
                        styles="text"
                        title={dictionary.components.formRenderer.delete}
                    />
                    <IconButton
                        icon={<IconChevronUp />}
                        onClick={onUpClick}
                        size="medium"
                        styles="text"
                        title={dictionary.components.formRenderer.moveUp}
                    />
                    <IconButton
                        icon={<IconChevronDown />}
                        onClick={onDownClick}
                        size="medium"
                        styles="text"
                        title={dictionary.components.formRenderer.moveDown}
                    />
                </div>
            </div>

            {/* Divider */}
            <hr className="border-base-neutral-600" />
            {/* Content */}
            <div>{children}</div>
            {validationError && (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={dictionary.components.lessons.elementValidationText}
                    description={validationError}
                />
            )}
        </div>
    );
};

export default DesignerLayout;
