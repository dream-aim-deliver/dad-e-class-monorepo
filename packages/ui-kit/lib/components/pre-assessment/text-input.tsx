import { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import RichTextEditor from "../rich-text-element/editor";
import { FormElement, FormElementTemplate, SubmitFunction } from "./types";
import RichTextRenderer from "../rich-text-element/renderer";
import { Descendant } from "slate";
import { serialize } from "../rich-text-element/serializer";
import { FormElementType } from "./types";
/**
 * Text Input Element for Pre-Assessment
 * This element allows users to input rich text content.
 * It includes a designer component, form component, and submission component.
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
};

function FormComponent({ elementInstance, submitValue }: { elementInstance: FormElement; submitValue?: SubmitFunction }) {
  if (elementInstance.type !== FormElementType.TextInput) return null;

  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const onLoseFocus = () => {
    if (!submitValue || !value) return;
    const content = serialize(value);
    submitValue(elementInstance.id.toString(), content);
  };

  return (
    <div className="text-text-primary flex flex-col gap-2">
      <RichTextEditor
        locale="en"
        name={`rich-text-${elementInstance.id}`}
        placeholder="Start typing..."
        initialValue={value}
        onChange={(value) => setValue(value)}
        onLoseFocus={onLoseFocus}
      />
    </div>
  );
}

function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
  if (elementInstance.type !== FormElementType.TextInput) return null;

  return (
    <div className="text-text-primary flex flex-col">
      <p>{elementInstance.helperText}</p>
      <RichTextRenderer content={elementInstance.helperText} />
    </div>
  );
}

export default textInputElement;

