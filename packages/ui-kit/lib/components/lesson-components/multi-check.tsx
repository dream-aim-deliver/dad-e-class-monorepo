import { useState } from "react";
import { FormElement, FormElementTemplate, SubmitFunction, FormElementType, valueType, DesignerComponentProps } from "../pre-assessment/types";
import DesignerLayout from "../designer-layout";
import { IconMultiChoice } from "../icons/icon-multi-choice";
import MultipleChoicePreview, { MultipleChoiceEdit, optionsType } from "../multiple-check";
import { getDictionary } from "@maany_shr/e-class-translations";


const multiCheckElement: FormElementTemplate = {
    type: FormElementType.MultiCheck,
    designerBtnElement: {
        icon: IconMultiChoice,
        label: "Multiple Choice"
    },
    // @ts-check
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
    validate: (elementInstance: FormElement, value: valueType) => {
        if (elementInstance.required) {
            return Array.isArray(value) ? (value as optionsType[]).some(opt => opt.isSelected) : false;
        }
        return true;
    }
};

interface MultiCheckDesignerProps extends DesignerComponentProps {
    onChange: (title: string, options: optionsType[]) => void;
    onRequiredChange: (isRequired: boolean) => void;
}

export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, onChange, onRequiredChange }: MultiCheckDesignerProps) {
    if (elementInstance.type !== FormElementType.MultiCheck) return null;
    const dictionary = getDictionary(locale);
    const [isRequired, setIsRequired] = useState<boolean>(elementInstance.required || false);

    const handleRequiredChange = () => {
        setIsRequired(prev => !prev);
        onRequiredChange(!isRequired);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.lessons.multiChoice}
            icon={<IconMultiChoice classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={false}
            isChecked={isRequired}
            onChange={handleRequiredChange}
        >
            <MultipleChoiceEdit
                locale={locale}
                initialTitle={elementInstance.title || ""}
                initialOptions={elementInstance.options || []}
                onChange={onChange} />


        </DesignerLayout>
    );
}

/**
 * FormComponent for rendering a multiple choice question in the form
 *
 * @param {Object} props - Component props
 * @param {FormElement} props.elementInstance - The form element instance containing the multiple choice question data
 * @param {SubmitFunction} [props.submitValue] - Function to handle submission of the form element value
 * @returns {JSX.Element|null} - Rendered component or null if element type doesn't match
 */
export function FormComponent({ elementInstance, submitValue }: { elementInstance: FormElement; submitValue?: SubmitFunction }) {
    const isMultiCheck = elementInstance.type === FormElementType.MultiCheck;

    const [options, setOptions] = useState<optionsType[]>(isMultiCheck ? elementInstance.options : []);

    if (!isMultiCheck) return null;

    const handleOptionChange = (option: string) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions.map(opt => ({
                ...opt,
                isSelected: opt.name === option ? !opt.isSelected : opt.isSelected
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
            <MultipleChoicePreview
                required={elementInstance.required}
                title={elementInstance.title}
                options={options}
                onChange={handleOptionChange}
            />
        </div>
    );
}

/**
 * ViewComponent for displaying a multiple choice question in read-only mode
 *
 * @param {Object} props - Component props
 * @param {FormElement} props.elementInstance - The form element instance containing the multiple choice question data
 * @returns {JSX.Element|null} - Rendered component or null if element type doesn't match
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.MultiCheck) return null;
    return (
        <div className="text-text-primary flex flex-col gap-2">
            <MultipleChoicePreview
                title={elementInstance.title}
                options={elementInstance.options}
                filled={true}
            />
        </div>
    );
}

export default multiCheckElement;
