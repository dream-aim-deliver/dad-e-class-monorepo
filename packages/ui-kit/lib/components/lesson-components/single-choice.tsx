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

import React, { useEffect, useState, useCallback } from "react";
import { IconSingleChoice } from "../icons/icon-single-choice";
import { FormElement, FormElementTemplate, SubmitFunction, FormElementType, SingleChoiceElement, valueType } from "../pre-assessment/types";
import SingleChoicePreview, { optionsType } from "../single-choice-preview";

/**
 * Template for the single choice form element
 * Defines the component's behavior, validation, and UI elements
 */
const singleChoiceElement: FormElementTemplate = {
    type: FormElementType.SingleChoice,
    designerBtnElement: {
        icon: IconSingleChoice,
        label: "Single Choice"
    },
    designerComponent: () => <div>Single Choice Designer</div>,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
    validate: (elementInstance: FormElement, value: valueType) => {
        if (elementInstance.required) {
            return Array.isArray(value) ? value.some(opt => opt.isSelected) : false;
        }
        return true;
    }
};

/**
 * Form Component for Single Choice
 * Renders the interactive single choice selection with radio buttons
 * 
 * @param elementInstance - The form element instance containing configuration
 * @param submitValue - Callback function for form submission
 */
function FormComponent({ elementInstance, submitValue }: { elementInstance: FormElement; submitValue?: SubmitFunction }) {
    if (elementInstance.type !== FormElementType.SingleChoice) return null;

    const [options, setOptions] = useState<optionsType[]>([]);

    useEffect(() => {
        const mappedOptions = elementInstance.options.map(option => ({
            ...option,
            isSelected: false
        }));
        setOptions(mappedOptions);
    }, [elementInstance.options]);

    const handleOptionChange = (option: string) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions.map(opt => ({
                ...opt,
                isSelected: opt.name === option,
            }));

            // Notify form builder of the change
            if (submitValue) {
                const updatedElement = {
                    ...elementInstance,
                    options: newOptions.map(opt => ({
                        name: opt.name,
                        isSelected: opt.isSelected
                    }))
                };
                submitValue(elementInstance.id, updatedElement);
            }

            return newOptions;
        });
    }

    return (
        <div className="text-text-primary flex flex-col gap-2">
            <SingleChoicePreview
             required={elementInstance.required}
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
               required={elementInstance.required}
                title={elementInstance.title}
                options={elementInstance.options}
                filled={true}
            />
        </div>
    );
}

export default singleChoiceElement;