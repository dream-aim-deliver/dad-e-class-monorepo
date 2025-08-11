import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { lessonElements } from "./element-core";
import { useRef, useState } from "react";
import { Button } from "../button";
import Banner from "../banner";
import { IconLoaderSpinner } from "../icons/icon-loader-spinner";
import { LessonElement, LessonElementType, valueType } from "./types";
import { TextInputElement, SingleChoiceElement, RichTextElement, MultiCheckElement, OneOutOfThreeElement } from "../lesson-components/types";
import { deserialize } from "../rich-text-element/serializer";
import { FormComponent as UploadFilesFormComponent } from "../course-builder-lesson-component/upload-files-lesson";


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
    onSubmit: (formValues: Record<string, LessonElement>) => void;
    /** Array of form elements to render in the form */
    elements: LessonElement[];
    /** Optional error message to display when isError is true */
    errorMessage?: string;
    // TODO: Add functions to handle interactive elements like UploadFiles
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
    const formValues = useRef<{ [key: string]: LessonElement }>({});
    const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({});
    const submitValue = (id: string, value: LessonElement) => {
        formValues.current[id] = value;
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: boolean } = {};

        for (const element of elements) {
            const formElement = formValues.current[element.id];

            if (!formElement) {
                if (element.required) {
                    newErrors[element.id] = true;
                }
                continue;
            }

            let value: valueType;
            switch (element.type) {
                case LessonElementType.TextInput: {
                    const textInput = formElement as TextInputElement;

                    const onDeserializationError = (message: string, error: Error) => {
                        // TODO: check how to pass a callback from the parent to here
                    }

                    value = 'content' in textInput ? deserialize({
                        serializedData: textInput.content ?? '',
                        onError: onDeserializationError
                    }
                    ) : [];
                    break;
                }
                case LessonElementType.SingleChoice: {
                    const singleChoice = formElement as SingleChoiceElement;
                    value = singleChoice?.options ?? [];
                    break;
                }
                case LessonElementType.RichText: {
                    const richText = formElement as RichTextElement;
                    value = richText?.content ?? '';
                    break;
                }
                case LessonElementType.MultiCheck: {
                    const multiCheck = formElement as MultiCheckElement;
                    value = multiCheck?.options ?? [];
                    break;
                }
                case LessonElementType.OneOutOfThree: {
                    const oneOutOfThree = formElement as OneOutOfThreeElement;
                    value = oneOutOfThree.data ?? [];
                    break;
                }
                // TODO: Add other element types
                default:
                    value = '';
            }

            const isValid = (lessonElements as any)[element.type].validate(element, value);
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

    const getErrorMessage = (element: LessonElement): string => {
        switch (element.type) {
            case LessonElementType.TextInput:
                return dictionary.components.formRenderer.fieldRequired;
            case LessonElementType.SingleChoice:
                return dictionary.components.formRenderer.selectOption;
            default:
                return dictionary.components.formRenderer.fieldRequired;
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-text-primary">
            {elements.map((elementInstance) => {
<<<<<<< HEAD
                const Element = (lessonElements as any)[elementInstance.type].formComponent;
=======
                // TODO: Implement handling for interactive elements like UploadFiles
                const Element = lessonElements[elementInstance.type].formComponent;
>>>>>>> 99172dd2 (Integrate additional lesson components)
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