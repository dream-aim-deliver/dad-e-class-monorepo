
import { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import RichTextEditor from "../rich-text-element/editor";
import { preAssessmentElement,elementType, preAssessmentInstance, submitFunction } from "./index";
import RichTextRenderer from "../rich-text-element/renderer";
import { Descendant } from "slate";
import { serialize } from "../rich-text-element/serializer";

const type:elementType="textInput";
/**
 * Text Input Element for Pre-Assessment
 * This element allows users to input rich text content.
 * It includes a designer component, form component, and submission component.
 */
const textInputElement:preAssessmentElement={
    type,
    designerBtnElement:{
        icon:IconRichText,
        label:"Text Input"
    },
    designerComponent:()=><div>Text Input Designer</div>,
    formComponent:FormComponent,
    submissionComponent:ViewComponent,
}

export function FormComponent({elementInstance,submitValue}:{elementInstance:preAssessmentInstance,submitValue?:submitFunction}){
    const [value, setValue] = useState<Descendant[]>([
        {
          type: 'paragraph',
          children: [{ text: 'ggg' }],
        },
      ]);
      

      const onLoseFocus = () => {
        if (!submitValue || !value) return;
        const content = serialize(value);
        submitValue(elementInstance.id, content);
      };
     

    return(<div className="text-text-primary flex flex-col gap-2">
     <RichTextEditor
     locale="en"
     name="rich-text"
     placeholder="Start typing..."
     initialValue={value}
     onChange={(value)=>setValue(value)}
     onLoseFocus={onLoseFocus}
     />
    </div>)
}

export function ViewComponent({elementInstance}:{elementInstance:preAssessmentInstance}){
    const {extraAttributes} = elementInstance;
    const content="[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This is a basic paragraph.\"}]}]"
    return(<div className="text-text-primary flex flex-col">
     <p>{extraAttributes.content}</p>
     <RichTextRenderer
     content={content}
     />
    </div>)
}
export default textInputElement;

