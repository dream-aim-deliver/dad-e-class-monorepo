import { useState } from "react";
import { IconSingleChoice } from "../icons/icon-single-choice";
import { FormElement, FormElementTemplate, SubmitFunction, FormElementType, valueType, DesignerComponentProps } from "../pre-assessment/types";
import SingleChoicePreview, { optionsType, SingleChoiceEdit } from "../single-choice";
import DesignerLayout from "../designer-layout";


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
        label: "Single Choice"
    },
    designerComponent: DesignerComponent,
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


function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== FormElementType.SingleChoice) return null;

    const [options, setOptions] = useState<optionsType[]>(elementInstance.options || []);
    const [title, setTitle] = useState<string>(elementInstance.title || "");
    const [isRequired, setIsRequired] = useState<boolean>(elementInstance.required || false);

    const handleRequiredChange = () => {
        setIsRequired(prev => !prev);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Single Choice"
            icon={<IconSingleChoice classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={false}
            isChecked={isRequired}
            onChange={handleRequiredChange}
        >
            <SingleChoiceEdit
                initialTitle={title}
                initialOptions={options}

                locale={locale}
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
export function FormComponent({ elementInstance, submitValue }: { elementInstance: FormElement; submitValue?: SubmitFunction }) {
    const isSingleChoice = elementInstance.type === FormElementType.SingleChoice;

    const [options, setOptions] = useState<optionsType[]>(isSingleChoice ? elementInstance.options : []);

    if (!isSingleChoice) return null;

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
                        id: opt.id,
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
