
import React from "react";
import { IconSingleChoice } from "../icons/icon-single-choice";
import { PreAssessmentElement,ElementType } from "./index";
const type:ElementType="singleChoice";
const singleChoiceElement:PreAssessmentElement={
    type,
    designerBtnElement:{
        icon:IconSingleChoice,
        label:"Rich Text"
    },
    designerComponent:()=><div>Single Choice Designer</div>,
    formComponent:()=><div>Rich Text Form</div>,
    submissionComponent:()=><div>Single Choice Submission</div>,

}

export default singleChoiceElement;