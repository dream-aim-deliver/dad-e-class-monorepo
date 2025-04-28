import React from "react";
import { IconRichText } from "../icons/icon-rich-text";

import { FormElement, FormElementTemplate, FormElementType } from "./types";
/**
 * Rich Text Element for Pre-Assessment
 * This element displays rich text content.
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
};

function FormComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.RichText) return null;

    return (
        <div className="text-text-primary flex flex-col gap-2">
            <p>{elementInstance.helperText}</p>
        </div>
    );
}

function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.RichText) return null;

    return (
        <div className="text-text-primary flex flex-col">
            <p>{elementInstance.helperText}</p>
        </div>
    );
}

export default richTextElement;

