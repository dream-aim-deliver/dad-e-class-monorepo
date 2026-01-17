'use client';

import { useState } from 'react';
import { IconRichText } from '../icons/icon-rich-text';
import {
    FormElement,
    FormElementTemplate,
    FormElementType,
    DesignerComponentProps,
    valueType,
    FormComponentProps,
} from '../pre-assessment/types';
import RichTextRenderer from '../rich-text-element/renderer';
import DesignerLayout from '../designer-layout';
import { RichTextEditor } from '../rich-text-element/editor';
import { Descendant } from 'slate';
import { deserialize, serialize } from '../rich-text-element/serializer';
import { getDictionary } from '@maany_shr/e-class-translations';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';
import { CheckBox } from '../checkbox';

/**
 * Template for the rich text form element
 * Defines the component's behavior, validation, and UI elements
 */
const richTextElement: FormElementTemplate = {
    type: FormElementType.RichText,
    designerBtnElement: {
        icon: IconRichText,
        label: 'Rich Text',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
};

/**
 * Rich Text Element for Pre-Assessment
 * This component provides a rich text display element for pre-assessment forms.
 * It supports formatted text content display and validation.
 *
 * Features:
 * - Rich text content display
 * - Required field validation
 * - Form submission handling
 * - Helper text display
 *
 * @example
 * ```tsx
 * <RichText
 *   elementInstance={{
 *     type: FormElementType.RichText,
 *     id: "rich-text-1",
 *     required: true,
 *     content: "Welcome to the assessment"
 *   }}
 * />
 * ```
 */

interface RichTextDesignerComponentProps extends DesignerComponentProps {
    onContentChange: (value: string) => void;
    onIncludeInMaterialsChange?: (value: boolean) => void;
}

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary, context = 'coach' } = props;

    if (elementInstance.type !== FormElementType.RichText)
        return dictionary.components.lessons.typeValidationText;

    // Student validation: Rich text is display-only, no user input validation needed
    if (context === 'student') {
        return undefined; // Always pass for student
    }

    // Coach validation: Check element structure (course builder - both designer and preview)
    if (!elementInstance.content || elementInstance.content.trim() === '') {
        return dictionary.components.richTextLesson.textContentValidationText;
    }

    return undefined;
};

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onContentChange,
    validationError,
    isCourseBuilder,
    onIncludeInMaterialsChange,
}: RichTextDesignerComponentProps) {
    if (elementInstance.type !== FormElementType.RichText) return null;
    const dictionary = getDictionary(locale);

    const onDeserializationError = (message: string, error: Error) => {
        // TODO: see how to pass a callback from the parent to here
    };

    const [content, setContent] = useState<Descendant[]>(
        deserialize({
            serializedData: elementInstance.content || '',
            onError: onDeserializationError,
        }),
    );

    const handleContentChange = (value: Descendant[]) => {
        setContent(value);
        const contentString = serialize(value);
        // TODO: This might be bad for performance. Consider migrating this to handleLoseFocus
        onContentChange(contentString);
    };

    const handleLoseFocus = (value: string) => {
        // TODO: Update the content in the element instance
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.lessons.richText}
            icon={<IconRichText classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            validationError={validationError}
            courseBuilder={isCourseBuilder}
        >
            {onIncludeInMaterialsChange && (
                <CheckBox
                    name={`include-in-materials-${elementInstance.id}`}
                    value={elementInstance.id}
                    checked={elementInstance.includeInMaterials}
                    withText
                    label="Include rich text in course material tab"
                    onChange={() =>
                        onIncludeInMaterialsChange(
                            !elementInstance.includeInMaterials,
                        )
                    }
                />
            )}
            <RichTextEditor
                name={`rich-text-${elementInstance.id}`}
                initialValue={content}
                onChange={handleContentChange}
                onLoseFocus={handleLoseFocus}
                placeholder={dictionary.components.formRenderer.pleaseEnterText}
                locale={locale}
                onDeserializationError={onDeserializationError}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Rich Text
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== FormElementType.RichText) return null;

    const dictionary = getDictionary(locale);

    const validationError = getValidationError({
        elementInstance,
        dictionary,
        context: 'coach',
    });
    if (validationError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    const onDeserializationError = (message: string, error: Error) => {
        // TODO: see how to pass a callback from the parent to here
    };

    return (
        <div className="text-text-primary flex flex-col gap-2 w-full">
            <RichTextRenderer
                content={elementInstance.content}
                onDeserializationError={onDeserializationError}
                className="w-full"
            />
        </div>
    );
}

/**
 * View Component for Rich Text
 * Renders the read-only view of the rich text content
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.RichText) return null;

    const onDeserializationError = (message: string, error: Error) => {
        // TODO: see how to pass a callback from the parent to here
    };

    return (
        <div className="text-text-primary flex flex-col">
            <RichTextRenderer
                content={elementInstance.content}
                onDeserializationError={onDeserializationError}
            />
        </div>
    );
}

export default richTextElement;
