import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { formElements } from "./form-element-core";
import { useRef, useState } from "react";
import { Button } from "../button";
import Banner from "../banner";
import { IconLoaderSpinner } from "../icons/icon-loader-spinner";
import { FormElement, FormElementType, valueType } from "./types";
import { TextInputElement, SingleChoiceElement, RichTextElement, multiCheckElement, OneOutOfThreeElement } from "../lesson-components/types";
import { deserialize } from "../rich-text-element/serializer";
/**
 * Props for the FormElementRenderer component
 * 
 * @interface FormElementRendererProps
 * @extends {isLocalAware}
 */
interface FormElementRendererProps extends isLocalAware {
    /** Indicates if the form is currently in loading state (e.g., during submission) */
    isLoading: boolean;
    /** Indicates if there was an error during form submission */
    isError: boolean;
    /** Callback function invoked when the form is successfully submitted and validated */
    onSubmit: (formValues: Record<string, FormElement>) => void;
    /** Array of form elements to render in the form */
    elements: FormElement[];
    /** Optional error message to display when isError is true */
    errorMessage?: string;
}

/**
 * FormElementRenderer - Renders a complete form with form elements and validation
 * 
 * This component takes an array of form elements and renders them in a form layout with
 * proper validation. It handles form submission, validation of required fields, and
 * displays appropriate error messages.
 *
 * @component
 * @example
 * ```tsx
 * <FormElementRenderer
 *   locale="en"
 *   isLoading={false}
 *   isError={false}
 *   elements={formElements}
 *   onSubmit={(values) => console.log("Form submitted:", values)}
 * />
 * ```
 *
 * @param {FormElementRendererProps} props - Component props
 * @param {boolean} props.isLoading - Indicates if the form is in loading state
 * @param {boolean} props.isError - Indicates if there was a submission error
 * @param {Function} props.onSubmit - Callback function called on successful form submission
 * @param {FormElement[]} props.elements - Array of form elements to render
 * @param {string} props.locale - Language locale for translations
 * @param {string} [props.errorMessage] - Optional error message to display
 * 
 * @returns {React.ReactElement} The rendered form with all elements and validation
 */
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
        const newErrors: { [key: string]: boolean } = {};

        for (const element of elements) {
            const formElement = formValues.current[element.id];

            if (!element.required) {
                continue;
            }

            if (!formElement) {
                newErrors[element.id] = true;
                continue;
            }

            let value: valueType;
            switch (element.type) {
                case FormElementType.TextInput: {
                    const textInput = formElement as TextInputElement;
                    value = 'content' in textInput ? deserialize(textInput.content) : [];
                    break;
                }
                case FormElementType.SingleChoice: {
                    const singleChoice = formElement as SingleChoiceElement;
                    value = singleChoice?.options ?? [];
                    break;
                }
                case FormElementType.RichText: {
                    const richText = formElement as RichTextElement;
                    value = richText?.content ?? '';
                    break;
                }
                case FormElementType.MultiCheck: {
                    const multiCheck = formElement as multiCheckElement;
                    value = multiCheck?.options ?? [];
                    break;
                }
                case FormElementType.OneOutOfThree:{
                    const oneOutOfThree = formElement as OneOutOfThreeElement;
                    value = oneOutOfThree.data ?? [];
                    break;
                }
                default:
                    value = '';
            }

            const isValid = formElements[element.type].validate(element, value);
            if (!isValid) {
                newErrors[element.id] = true;
            }
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        e.stopPropagation();
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
                return dictionary.components.formRenderer.fieldRequired;
            case FormElementType.SingleChoice:
                return dictionary.components.formRenderer.selectOption;
            default:
                return dictionary.components.formRenderer.fieldRequired;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-[560px] p-6 flex flex-col gap-4 bg-card-fill shadow-[0px_4px_12px_0px_base-neutral-950] border-1 rounded-medium border-card-stroke text-text-primary">
            <h3>{dictionary.components.formRenderer.title}</h3>
            <div className="flex flex-col gap-4">
                {elements.map((elementInstance) => {
                    const Element = formElements[elementInstance.type].formComponent;
                    return (
                        <div key={elementInstance.id.toString()} className="flex flex-col gap-2 items-start">
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
                description={dictionary.components.formRenderer.alertText}
            />
            <div className="relative w-full">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full capitalize"
                    disabled={isLoading}
                    text={dictionary.components.formRenderer.submitText}
                />
                {isLoading && <IconLoaderSpinner classNames="absolute left-[50%] top-[20%] animate-spin" />}
            </div>
        </form>
    );
}