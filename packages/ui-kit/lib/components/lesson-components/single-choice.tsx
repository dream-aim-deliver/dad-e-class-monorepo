'use client';

import { useState } from 'react';
import { IconSingleChoice } from '../icons/icon-single-choice';
import {
    FormElement,
    FormElementTemplate,
    SubmitFunction,
    FormElementType,
    valueType,
    DesignerComponentProps,
    FormComponentProps,
} from '../pre-assessment/types';
import SingleChoicePreview, {
    optionsType,
    SingleChoiceEdit,
} from '../single-choice';
import DesignerLayout from '../designer-layout';
import { ElementValidator } from '../lesson/types';
import { getDictionary } from '@maany_shr/e-class-translations';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary, context = 'coach' } = props;

    if (elementInstance.type !== FormElementType.SingleChoice)
        return dictionary.components.lessons.typeValidationText;

    // Student validation: Always check if user has made a selection (actual form submission)
    if (context === 'student') {
        const hasSelection =
            elementInstance.options &&
            elementInstance.options.some((option) => option.isSelected);
        if (!hasSelection) {
            return dictionary.components.formRenderer.fieldRequired;
        }
        return undefined; // Student validation passed
    }

    // Coach validation: Check element structure (course builder - both designer and preview)
    // Check if title is empty
    if (!elementInstance.title || elementInstance.title.trim() === '') {
        return dictionary.components.singleChoiceLesson.titleValidationText;
    }

    // Check if there is at least one option
    if (!elementInstance.options || elementInstance.options.length === 0) {
        return dictionary.components.singleChoiceLesson
            .optionCountValidationText;
    }

    // Check if all option names are non-empty
    const hasEmptyOptionName = elementInstance.options.some(
        (option) => !option.name || option.name.trim() === '',
    );
    if (hasEmptyOptionName) {
        return dictionary.components.singleChoiceLesson
            .optionNameValidationText;
    }

    return undefined;
};

/**
 * Single Choice Element for Pre-Assessment
 * This component provides a single-choice selection element for pre-assessment forms.
 * It supports multiple options with radio button selection and validation.
 *
 * Features:
 * - Radio button selection
 * - Required field validation
 * - Form submission handling
 * - Title and helper text display
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <SingleChoice
 *   elementInstance={{
 *     type: FormElementType.SingleChoice,
 *     id: "choice-1",
 *     required: true,
 *     title: "Select an option",
 *     options: [
 *       { name: "Option 1" },
 *       { name: "Option 2" }
 *     ]
 *   }}
 *   submitValue={(id, value) => console.log(id, value)}
 * />
 * ```
 */

/**
 * Template for the single choice form element
 * Defines the component's behavior, validation, and UI elements
 */
const singleChoiceElement: FormElementTemplate = {
    type: FormElementType.SingleChoice,
    designerBtnElement: {
        icon: IconSingleChoice,
        label: 'Single Choice',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
};

/**
 * Designer Component for Single Choice
 * Renders the configuration interface for single choice questions in the form builder
 *
 * Features:
 * - Title editing
 * - Option management (add/remove/edit)
 * - Required field toggle
 * - Drag and drop reordering
 *
 * @param elementInstance - The form element instance containing configuration
 * @param locale - The current locale for translations
 * @param onUpClick - Callback when moving element up
 * @param onDownClick - Callback when moving element down
 * @param onDeleteClick - Callback when deleting element
 */

interface SingleChoiceDesignerProps extends DesignerComponentProps {
    onChange: (title: string, options: optionsType[]) => void;
    onRequiredChange: (isRequired: boolean) => void;
}

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onChange,
    onRequiredChange,
    validationError,
    isCourseBuilder,
}: SingleChoiceDesignerProps) {
    const dictionary = getDictionary(locale);

    if (elementInstance.type !== FormElementType.SingleChoice) return null;

    const [isRequired, setIsRequired] = useState<boolean>(
        elementInstance.required || false,
    );

    const handleRequiredChange = () => {
        setIsRequired((prev) => !prev);
        onRequiredChange(!isRequired);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.lessons.singleChoice}
            icon={<IconSingleChoice classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={isCourseBuilder}
            isChecked={isRequired}
            onChange={handleRequiredChange}
            validationError={validationError}
        >
            <SingleChoiceEdit
                initialTitle={elementInstance.title}
                initialOptions={elementInstance.options}
                locale={locale}
                onChange={onChange}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Single Choice
 * Renders the interactive single choice selection with radio buttons
 *
 * @param elementInstance - The form element instance containing configuration
 * @param submitValue - Callback function for form submission
 */
export function FormComponent({
    elementInstance,
    submitValue,
    locale,
}: FormComponentProps) {
    const isSingleChoice =
        elementInstance.type === FormElementType.SingleChoice;

    const [options, setOptions] = useState<optionsType[]>(
        isSingleChoice ? elementInstance.options : [],
    );

    if (!isSingleChoice) return null;

    const dictionary = getDictionary(locale);

    const validationError = getValidationError({
        elementInstance,
        dictionary,
        context: 'coach',
    });
    if (validationError) {
        return (
            <DefaultError
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    const handleOptionChange = (option: string) => {
        setOptions((prevOptions) => {
            const newOptions = prevOptions.map((opt) => ({
                ...opt,
                isSelected: opt.name === option,
            }));

            // Notify form builder of the change
            if (submitValue) {
                const updatedElement = {
                    ...elementInstance,
                    options: newOptions.map((opt) => ({
                        id: opt.id,
                        name: opt.name,
                        isSelected: opt.isSelected,
                    })),
                };
                submitValue(elementInstance.id, updatedElement);
            }

            return newOptions;
        });
    };
    return (
        <div className="text-text-primary flex flex-col gap-2">
            <SingleChoicePreview
                required={elementInstance.required ?? false}
                title={elementInstance.title}
                options={options}
                onChange={handleOptionChange}
            />
        </div>
    );
}

/**
 * View Component for Single Choice
 * Renders the read-only view of the selected option
 *
 * @param elementInstance - The form element instance containing the selected option
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.SingleChoice) return null;
    return (
        <div className="text-text-primary flex flex-col gap-2">
            <SingleChoicePreview
                required={elementInstance.required ?? false}
                title={elementInstance.title}
                options={elementInstance.options}
                filled={true}
            />
        </div>
    );
}

export default singleChoiceElement;
