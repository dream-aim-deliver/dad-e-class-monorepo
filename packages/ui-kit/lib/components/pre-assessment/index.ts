import React from "react";
import  richTextElement from "./rich-text";
import  singleChoiceElement  from "./single-choice";


export type ElementType = "richText" |"singleChoice";


export type PreAssessmentElement={
    type:  ElementType;
    designerBtnElement:{
        icon:React.ElementType,
        label:string
    }
    designerComponent:React.FC<{
        elementInstance:PreAssessmentInstance
    }>;
    formComponent:React.FC<{
        elementInstance:PreAssessmentInstance
    }>;
    submissionComponent:React.FC<{
        elementInstance:PreAssessmentInstance
    }>;
}

export interface PreAssessmentInstance{
    id:string;
    type:  ElementType;
    extraAttributes?:Record<string,any>;
    
}

type PreAssessmentType={
    [key in ElementType]: PreAssessmentElement
}

export const preAssessmentElements:PreAssessmentType={
    richText:richTextElement,
    singleChoice:singleChoiceElement,
}
