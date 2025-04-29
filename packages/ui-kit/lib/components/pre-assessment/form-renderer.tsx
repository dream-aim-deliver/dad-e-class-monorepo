import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { formElements } from "./form-element-core";
import { useRef, useState } from "react";
import { Button } from "../button";
import Banner from "../banner";
import { IconLoaderSpinner } from "../icons/icon-loader-spinner";
import { FormElement, FormElementType, valueType, TextInputElement, SingleChoiceElement, RichTextElement, ChoiceOption } from "./types";

interface FormElementRendererProps extends isLocalAware {
    isLoading: boolean;
    isError: boolean;
    onSubmit: (formValues: Record<string, FormElement>) => void;
    elements: FormElement[];
    errorMessage?: string;
}

export function FormElementRenderer({
    isLoading,
    isError,
    onSubmit,
    elements,
    locale,
    errorMessage
}: FormElementRendererProps) {
    const dictionary = getDictionary(locale);
    const formValues = useRef<{ [key: string]: FormElement }>({});
    const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({});
    const submitValue = (id: string, value: FormElement) => {
        formValues.current[id] = value;
    };

    const validateForm = (): boolean => {
        // Reset previous errors
        const newErrors: { [key: string]: boolean } = {};

        // Validate each form element
        for (const element of elements) {
            const formElement = formValues.current[element.id];

            // Skip validation if element is not required and has no value
            if (!element.required && !formElement) {
                continue;
            }

            // Extract the appropriate value based on element type
            let value: valueType;
            switch (element.type) {
                case FormElementType.TextInput:
                    const textInput = formElement as TextInputElement;
                    value = textInput?.content ? JSON.parse(textInput.content) : [];
                    break;
                case FormElementType.SingleChoice:
                    const singleChoice = formElement as SingleChoiceElement;
                    value = (singleChoice?.options || []).map(opt => ({
                        name: opt.name,
                        isSelected: opt.isSelected
                    }));
                    break;
                case FormElementType.RichText:
                    const richText = formElement as RichTextElement;
                    value = richText?.content || '';
                    break;
                default:
                    value = '';
            }

            const isValid = formElements[element.type].validate(element, value);

            if (!isValid) {
                newErrors[element.id] = true;
            }
        }

        // Update errors state
        setFormErrors(newErrors);

        // Return true if no errors were found
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        // Validate the form before submission
        if (!validateForm()) {
            // If validation fails, don't submit
            return;
        }

        onSubmit(formValues.current);
    };

    const getErrorMessage = (element: FormElement): string => {
        switch (element.type) {
            case FormElementType.TextInput:
                return dictionary.components.formBuilder.fieldRequired;
            case FormElementType.SingleChoice:
                return dictionary.components.formBuilder.selectOption;
            case FormElementType.RichText:
                return dictionary.components.formBuilder.fieldRequired;
            default:
                return dictionary.components.formBuilder.fieldRequired;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-[560px] p-6 flex flex-col gap-4 bg-card-fill shadow-[0px_4px_12px_0px_base-neutral-950] border-1 rounded-medium border-card-stroke text-text-primary">
            <h3>{dictionary.components.formBuilder.title}</h3>
            <div className="flex flex-col gap-4">
                {elements.map((elementInstance) => {
                    const Element = formElements[elementInstance.type].formComponent;
                    return (
                        <div key={elementInstance.id.toString()} className="flex flex-col gap-2">
                            <Element
                                submitValue={submitValue}
                                elementInstance={elementInstance}
                                locale={locale}
                            />
                            {formErrors[elementInstance.id] && (
                                <Banner
                                    style="error"
                                    description={getErrorMessage(elementInstance)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {isError && (
                <Banner
                    style="error"
                    description={errorMessage || "An error occurred while submitting the form. Please try again."}
                />
            )}
            <Banner
                style="warning"
                description={dictionary.components.formBuilder.alertText}
            />
            <div className="relative w-full">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full capitalize"
                    disabled={isLoading}
                    text={dictionary.components.formBuilder.submitText}
                />
                {isLoading && <IconLoaderSpinner classNames="absolute left-[50%] top-[20%] animate-spin" />}
            </div>
        </form>
    );
}