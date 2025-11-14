'use client';

import { useState } from 'react';
import { IconRichText } from '../icons/icon-rich-text';
import { RichTextEditor as TextInputEditor } from '../rich-text-element/editor';
import {
    FormElement,
    FormElementTemplate,
    FormElementType,
    valueType,
    FormComponentProps,
    DesignerComponentProps,
} from '../pre-assessment/types';
import { default as TextInputRenderer } from '../rich-text-element/renderer';
import { Descendant, Node } from 'slate';
import { serialize, deserialize } from '../rich-text-element/serializer';
import { getDictionary } from '@maany_shr/e-class-translations';
import DesignerLayout from '../designer-layout';
import { IconTextInput } from '../icons/icon-text-input';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary, context = 'coach' } = props;

    if (elementInstance.type !== FormElementType.TextInput)
        return dictionary.components.lessons.typeValidationText;

    // Student validation: Always check if user has entered content (actual form submission)
    if (context === 'student') {
        if (
            !elementInstance.content ||
            elementInstance.content.trim() === ''
        ) {
            return dictionary.components.formRenderer.fieldRequired;
        }
        return undefined; // Student validation passed
    }

    // Coach validation: Check if helperText is provided (coach needs to configure helper text)
    if (
        !elementInstance.helperText ||
        elementInstance.helperText.trim() === ''
    ) {
        return dictionary.components.textInputLesson.textContentValidationText;
    }

    return undefined;
};

/**
 * Template for the text input form element
 * Defines the component's behavior, validation, and UI elements
 */
const textInputElement: FormElementTemplate = {
    type: FormElementType.TextInput,
    designerBtnElement: {
        icon: IconRichText,
        label: 'Text Input',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
};

/**
 * Text Input Element for Pre-Assessment
 * This component provides a rich text input field for pre-assessment forms.
 * It supports validation, required fields, and form submission.
 *
 * Features:
 * - Rich text editing capabilities
 * - Required field validation
 * - Form submission handling
 * - Helper text display
 * - Placeholder text support
 *
 * @example
 * ```tsx
 * <TextInput
 *   elementInstance={{
 *     type: FormElementType.TextInput,
 *     id: "text-1",
 *     required: true,
 *     helperText: "Enter your answer"
 *   }}
 *   submitValue={(id, value) => console.log(id, value)}
 *   locale="en"
 * />
 * ```
 */

interface TextInputDesignerComponentProps extends DesignerComponentProps {
    onRequiredChange: (isRequired: boolean) => void;
    onHelperTextChange: (helperText: string) => void;
    isCourseBuilder: boolean;
}

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onHelperTextChange,
    onRequiredChange,
    validationError,
    isCourseBuilder,
}: TextInputDesignerComponentProps) {
    if (elementInstance.type !== FormElementType.TextInput) return null;
    const dictionary = getDictionary(locale);

    const onDeserializationError = (message: string, error: Error) => {
        // TODO: see how to pass a callback from the parent component to here
    };

    const [helperText, setHelperText] = useState<Descendant[]>(
        deserialize({
            serializedData: elementInstance.helperText,
            onError: onDeserializationError,
        }),
    );
    const [isRequired, setIsRequired] = useState<boolean>(
        elementInstance.required || false,
    );

    const handleContentChange = (value: Descendant[]) => {
        const contentString = serialize(value);
        setHelperText(value);
        onHelperTextChange(contentString);
    };

    const handleLoseFocus = (value: string) => {
        // TODO: Update the element instance with the new content
    };

    const handleRequiredChange = () => {
        setIsRequired((prev) => !prev);
        onRequiredChange(!isRequired);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.lessons.textInput}
            icon={<IconTextInput classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={isCourseBuilder}
            isChecked={isRequired}
            onChange={handleRequiredChange}
            validationError={validationError}
        >
            <section className="w-full flex items-center">
                <TextInputEditor
                    name={`rich-text-${elementInstance.id}`}
                    initialValue={helperText}
                    onChange={handleContentChange}
                    onLoseFocus={handleLoseFocus}
                    placeholder={
                        dictionary.components.formRenderer.pleaseEnterText
                    }
                    locale={locale}
                    onDeserializationError={onDeserializationError}
                />
            </section>
        </DesignerLayout>
    );
}

/**
 * Form Component for Text Input
 * Renders the editable text input field with validation and submission handling
 *
 * @param elementInstance - The form element instance containing configuration
 * @param submitValue - Callback function for form submission
 * @param locale - The current locale for translations
 */
export function FormComponent({
    elementInstance,
    submitValue,
    locale,
    disableValidation,
}: FormComponentProps) {
    if (elementInstance.type !== FormElementType.TextInput) return null;

    const dictionary = getDictionary(locale);

    if (!disableValidation) {
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
    }

    const onDeserializationError = (message: string, error: Error) => {
        // TODO: see how to pass a callback from the parent component to here
    };

    const [value, setValue] = useState<Descendant[]>(
        deserialize({ serializedData: elementInstance.content ?? '', onError: onDeserializationError }),
    );

    const onLoseFocus = () => {
        if (!submitValue || !value) return;
        const content = serialize(value);
        const updatedElement = {
            ...elementInstance,
            content,
        };
        submitValue(elementInstance.id.toString(), updatedElement);
    };

    return (
        <div className="text-text-primary flex flex-col gap-2 w-full">
            <section className="text-sm flex leading-[21px]">
                <TextInputRenderer
                    content={elementInstance.helperText}
                    onDeserializationError={onDeserializationError}
                />
                {elementInstance.required && (
                    <span className="text-feedback-error-primary ml-1">*</span>
                )}
            </section>
            <section className="w-full">
                <TextInputEditor
                    locale={locale}
                    name={`rich-text-${elementInstance.id}`}
                    placeholder={
                        dictionary.components.formRenderer.pleaseEnterText
                    }
                    initialValue={value}
                    onChange={(value) => setValue(value)} // TODO: This is a no-op that will be replaced with a real function when we implement the builder
                    onLoseFocus={onLoseFocus}
                    onDeserializationError={onDeserializationError}
                />
            </section>
        </div>
    );
}

/**
 * View Component for Text Input
 * Renders the read-only view of the text input field
 *
 * @param elementInstance - The form element instance containing the content to display
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.TextInput) return null;

    const onDeserializationError = (message: string, error: Error) => {
        // TODO: see how to pass a callback from the parent component to here
    };

    return (
        <div className="text-text-primary flex flex-col gap-4">
            <section className="text-sm leading-[21px] text-text-secondary">
                <TextInputRenderer
                    content={elementInstance.helperText}
                    onDeserializationError={onDeserializationError}
                />
            </section>
            {'content' in elementInstance && (
                <TextInputRenderer
                    className="p-2 bg-base-neutral-800 rounded-md"
                    content={elementInstance.content ?? []}
                    onDeserializationError={onDeserializationError}
                />
            )}
        </div>
    );
}

export default textInputElement;
