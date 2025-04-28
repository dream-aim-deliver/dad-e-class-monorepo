import { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import { RichTextEditor as TextInputEditor } from "../rich-text-element/editor";
import { FormElement, FormElementTemplate, SubmitFunction } from "./types";
import { default as TextInputRenderer } from "../rich-text-element/renderer";
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
    const updatedElement = {
      ...elementInstance,
      content
    };
    submitValue(elementInstance.id.toString(), updatedElement);
  };

  return (
    <div className="text-text-primary flex flex-col gap-2">
      <TextInputEditor
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
      <p>{elementInstance.content}</p>
      <TextInputRenderer content={elementInstance.content} />
    </div>
  );
}

export default textInputElement;

