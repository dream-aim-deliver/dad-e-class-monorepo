import React, { useEffect, useState } from "react";
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
        // Map ChoiceOption to optionsType
        const mappedOptions = elementInstance.options.map(option => ({
            label: option.name,
            isSelected: false
        }));
        setOptions(mappedOptions);
    }, [elementInstance.options]);

    function onChange(option: string) {
        setOptions((prevOptions) =>
            prevOptions?.map((opt) => ({
                ...opt,
                isSelected: opt.label === option,
            }))
        );
    }

    return (
        <div className="text-text-primary flex flex-col gap-2">
            <SingleChoicePreview
                title={elementInstance.title}
                options={options}
                onChange={(option) => {
                    onChange(option);
                    if (submitValue) {
                        submitValue(elementInstance.id.toString(), JSON.stringify(options));
                    }
                }}
            />
        </div>
    );
}

export default singleChoiceElement;