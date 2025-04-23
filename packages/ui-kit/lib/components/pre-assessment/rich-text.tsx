
import { IconRichText } from "../icons/icon-rich-text";
import { PreAssessmentElement,ElementType } from "./index";
const type:ElementType="richText";
const richTextElement:PreAssessmentElement={
    type,
    designerBtnElement:{
        icon:()=><IconRichText/>,
        label:"Rich Text"
    },
    designerComponent:()=><div>Rich Text Designer</div>,
    formComponent:()=><div>Rich Text Form</div>,
    submissionComponent:()=><div>Rich Text Submission</div>,
}
export default richTextElement;