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
import { validatorPerType } from "./validators";


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
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | null }>({});
    const submitValue = (id: string, value: LessonElement) => {
        formValues.current[id] = value;
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string | null } = {};

        for (const element of elements) {
            const formElement = formValues.current[element.id];

            
            const elementToValidate = formElement || element;

            // Use the new validation system
            const validator = validatorPerType[element.type];
            if (validator) {
                const validationError = validator({
                    elementInstance: elementToValidate,
                    dictionary: dictionary
                });

                if (validationError) {
                    newErrors[element.id] = validationError;
                }
            } else if (!formElement && element.required) {
                // Fallback if no validator exists
                newErrors[element.id] = dictionary.components.formRenderer.fieldRequired;
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
        // Return the stored error message or fallback to generic message
        return formErrors[element.id] || dictionary.components.formRenderer.fieldRequired;
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-text-primary">
            {elements.map((elementInstance) => {
                // @ts-ignore
                const Element = lessonElements[elementInstance.type].formComponent;
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