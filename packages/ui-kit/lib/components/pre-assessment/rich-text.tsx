
import { useState } from "react";
import { IconRichText } from "../icons/icon-rich-text";
import RichTextEditor from "../rich-text-element/editor";
import { PreAssessmentElement,ElementType, PreAssessmentInstance } from "./index";
import { RichTextAction } from "../../utils/constants";
import RichTextRenderer from "../rich-text-element/renderer";
const type:ElementType="richText";
const richTextElement:PreAssessmentElement={
    type,
    designerBtnElement:{
        icon:IconRichText,
        label:"Rich Text"
    },
    designerComponent:()=><div>Rich Text Designer</div>,
    formComponent:FormComponent,
    submissionComponent:ViewComponent,
}

export function FormComponent({elementInstance}:{elementInstance:PreAssessmentInstance}){
    const {extraAttributes} = elementInstance;
    const [value,setValue]=useState<string>("")
    return(<div className="text-text-primary flex flex-col">
     <p>{extraAttributes.content}</p>
     <RichTextEditor
     locale="en"
     name="rich-text"
     placeholder="Start typing..."
     initialValue={[]}
     onLoseFocus={(value)=>setValue(value)}
     />
    </div>)
}

export function ViewComponent({elementInstance}:{elementInstance:PreAssessmentInstance}){
    const {extraAttributes} = elementInstance;
    const content="[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This is a basic paragraph.\"}]}]"
    return(<div className="text-text-primary flex flex-col">
     <p>{extraAttributes.content}</p>
     <RichTextRenderer
     content={content}
     />
    </div>)
}
export default richTextElement;

