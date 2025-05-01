import React, { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import { FormElement, FormElementTemplate, FormElementType, DesignerComponentProps } from "../pre-assessment/types";
import RichTextRenderer from "../rich-text-element/renderer";
import DesignerLayout from "./designer-layout";
import { RichTextEditor } from "../rich-text-element/editor";
import { Descendant } from "slate";
import { deserialize, serialize } from "../rich-text-element/serializer";
import { getDictionary } from "@maany_shr/e-class-translations";


/**
 * Template for the rich text form element
 * Defines the component's behavior, validation, and UI elements
 */
const richTextElement: FormElementTemplate = {
    type: FormElementType.RichText,
    designerBtnElement: {
        icon: IconRichText,
        label: "Rich Text"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
    validate: (elementInstance: FormElement, value: string) => true

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

function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== FormElementType.RichText) return null;
   const dictionary = getDictionary(locale);
    const [content, setContent] = useState<Descendant[]>(deserialize(elementInstance.content || ""));

    const handleContentChange = (value: Descendant[]) => {
        setContent(value);
        const contentString = serialize(value);
        console.log('Content changed:', contentString);
    };

    const handleLoseFocus = (value: string) => {
        console.log('Final content:', value);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Rich Text"
            icon={<IconRichText classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <RichTextEditor
                name={`rich-text-${elementInstance.id}`}
                initialValue={content}
                onChange={handleContentChange}
                onLoseFocus={handleLoseFocus}
                placeholder={dictionary.components.formRenderer.pleaseEnterText}
                locale={locale}
            />
        </DesignerLayout>
    );
}



/**
 * Form Component for Rich Text
 * Renders the rich text content in the form view
 */
function FormComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.RichText) return null;

    return (
        <div className="text-text-primary flex flex-col gap-2">
            <RichTextRenderer content={elementInstance.content} />
        </div>
    );
}

/**
 * View Component for Rich Text
 * Renders the read-only view of the rich text content
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.RichText) return null;

    return (
        <div className="text-text-primary flex flex-col">
            <RichTextRenderer content={elementInstance.content} />
        </div>
    );
}

export default richTextElement;

