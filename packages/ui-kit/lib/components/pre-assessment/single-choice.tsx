import React, { useEffect, useState, useCallback } from "react";
import { IconSingleChoice } from "../icons/icon-single-choice";
import { FormElement, FormElementTemplate, SubmitFunction } from "./types";
import SingleChoicePreview, { optionsType } from "../single-choice-preview";
import { FormElementType } from "./types";
/**
 * Single Choice Element for Pre-Assessment
 * This element allows users to select a single option from a list.
 */
const singleChoiceElement: FormElementTemplate = {
    type: FormElementType.SingleChoice,
    designerBtnElement: {
        icon: IconSingleChoice,
        label: "Single Choice"
    },
    designerComponent: () => <div>Single Choice Designer</div>,
    formComponent: FormComponent,
    submissionComponent: () => <div>Single Choice Submission</div>,
};

function FormComponent({ elementInstance, submitValue }: { elementInstance: FormElement; submitValue?: SubmitFunction }) {
    if (elementInstance.type !== FormElementType.SingleChoice) return null;

    const [options, setOptions] = useState<optionsType[]>([]);

    useEffect(() => {
        const mappedOptions = elementInstance.options.map(option => ({
            label: option.name,
            isSelected: false
        }));
        setOptions(mappedOptions);
    }, [elementInstance.options]);

    const handleOptionChange = (option: string) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions.map(opt => ({
                ...opt,
                isSelected: opt.label === option,
            }));

            // Notify form builder of the change
            if (submitValue) {
                const updatedElement = {
                    ...elementInstance,
                    options: newOptions.map(opt => ({
                        name: opt.label,
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
                title={elementInstance.title}
                options={options}
                onChange={handleOptionChange}
            />
        </div>
    );
}

export default singleChoiceElement;