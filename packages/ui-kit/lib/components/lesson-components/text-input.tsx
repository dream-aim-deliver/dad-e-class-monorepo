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

import { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import { RichTextEditor as TextInputEditor } from "../rich-text-element/editor";
import { FormElement, FormElementTemplate, SubmitFunction, valueType, FormComponentProps } from "../pre-assessment/types";
import { default as TextInputRenderer } from "../rich-text-element/renderer";
import { Descendant, Node } from "slate";
import { serialize } from "../rich-text-element/serializer";
import { FormElementType } from "../pre-assessment/types";
import { getDictionary } from "@maany_shr/e-class-translations";

/**
 * Template for the text input form element
 * Defines the component's behavior, validation, and UI elements
 */
const textInputElement: FormElementTemplate = {
  type: FormElementType.TextInput,
  designerBtnElement: {
    icon: IconRichText,
    label: "Text Input"
  },
  designerComponent: () => <div>Text Input Designer</div>,
  formComponent: FormComponent,
  submissionComponent: ViewComponent,
  validate: (elementInstance: FormElement, value: valueType) => {
    if (elementInstance.required) {
      if (Array.isArray(value)) {
        const content = value.map(n => Node.string(n)).join('\n').trim();
        return content.length > 0;
      }
      return false;
    }
    return true;
  }
};

/**
 * Form Component for Text Input
 * Renders the editable text input field with validation and submission handling
 * 
 * @param elementInstance - The form element instance containing configuration
 * @param submitValue - Callback function for form submission
 * @param locale - The current locale for translations
 */
function FormComponent({ elementInstance, submitValue, locale }: FormComponentProps) {
  if (elementInstance.type !== FormElementType.TextInput) return null;
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const dictionary = getDictionary(locale);

  const onLoseFocus = () => {
    if (!submitValue || !value) return;
    const content = serialize(value);
    const updatedElement = {
      ...elementInstance,
      content
    };
    submitValue(elementInstance.id.toString(), updatedElement);
  };

  return (
    <div className="text-text-primary flex flex-col gap-2">
      <p className="text-sm leading-[21px]">
        {elementInstance.helperText}
        {elementInstance.required && <span className="text-feedback-error-primary ml-1">*</span>}
      </p>
      <TextInputEditor
        locale={locale}
        name={`rich-text-${elementInstance.id}`}
        placeholder={dictionary.components.formBuilder.pleaseEnterText}
        initialValue={value}
        onChange={(value) => setValue(value)}
        onLoseFocus={onLoseFocus}
      />
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

  return (
    <div className="text-text-primary flex flex-col gap-4">
      <div className="text-sm leading-[21px] text-text-secondary">
        <TextInputRenderer content={elementInstance.helperText} />
      </div>
      <TextInputRenderer className="p-2 bg-base-neutral-800  rounded-md" content={elementInstance.content} />
    </div>
  );
}

export default textInputElement;

