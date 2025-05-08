import React, { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import { FormElement, FormElementTemplate, FormElementType, DesignerComponentProps } from "../pre-assessment/types";
import RichTextRenderer from "../rich-text-element/renderer";
import DesignerLayout from "./designer-layout";
import { RichTextEditor } from "../rich-text-element/editor";
import { Descendant } from "slate";
import { deserialize, serialize } from "../rich-text-element/serializer";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconHeading } from "../icons/icon-heading";
import { HeadingLesson, HeadingLessonPreview } from "../heading-type";


/**
 * Template for the Heading form element
 * Defines the component's behavior, validation, and UI elements
 */
const headingTextElement: FormElementTemplate = {
    type: FormElementType.HeadingText,
    designerBtnElement: {
        icon: IconHeading,
        label: "Heading"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
    validate: (elementInstance: FormElement, value: string) => true

};
/**
 * Heading  for Pre-Assessment
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
  if(elementInstance.type !== FormElementType.HeadingText) return null;
   const dictionary = getDictionary(locale);



    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Heading"
            icon={<IconHeading classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={false}
        >
           <HeadingLesson
           initialHeadingType={elementInstance.headingType}
           initialHeadingValue={elementInstance.heading}
           locale={locale}
           onChange={(value)=>console.log(value)}
           />
        </DesignerLayout>
    );
}



/**
 * Form Component for Rich Text
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.HeadingText) return null;

    const heading = elementInstance.heading || ""; // Default to "h1" if undefined
    const type = elementInstance.headingType || "h1";

    const headingValue = {
        heading,
         type
    };

    return (
     <HeadingLessonPreview headingValue={headingValue} />
    
    );
}

/**
 * View Component for Rich Text
 * Renders the read-only view of the rich text content
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.HeadingText) return null;

    const heading = elementInstance.heading || ""; // Default to "h1" if undefined
    const type = elementInstance.headingType || "h1";

    const headingValue = {
        heading,
       type
    };

    return (
        <div className="text-text-primary flex flex-col gap-2">
            <HeadingLessonPreview headingValue={headingValue} />
        </div>
    );
}

export default headingTextElement;

