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

import React, { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import { FormElement, FormElementTemplate, FormElementType } from "../pre-assessment/types";
import RichTextRenderer from "../rich-text-element/renderer";

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
    designerComponent: () => <div>Rich Text Designer</div>,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
    validate: (elementInstance: FormElement, value: string) => {
        if (elementInstance.required) {
            return value.length > 0;
        }
        return true;
    }
};

/**
 * Form Component for Rich Text
 * Renders the rich text content in the form view
 * 
 * @param elementInstance - The form element instance containing the content to display
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
 * 
 * @param elementInstance - The form element instance containing the content to display
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

