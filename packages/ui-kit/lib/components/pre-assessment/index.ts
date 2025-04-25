import React from "react";
import  richTextElement from "./rich-text";
import  singleChoiceElement  from "./single-choice";


export type elementType = "richText" |"singleChoice";

export type submitFunction = (key: string, value: string) => void;

export type preAssessmentElement={
    type:  elementType;
    designerBtnElement:{
        icon:React.ElementType,
        label:string
    }
    designerComponent:React.FC<{
        elementInstance:preAssessmentInstance
    }>;
    formComponent:React.FC<{
        elementInstance:preAssessmentInstance,
        submitValue?: submitFunction;
    }>;
    submissionComponent:React.FC<{
        elementInstance:preAssessmentInstance
    }>;
}

export interface preAssessmentInstance{
    id:string;
    type:  elementType;
    extraAttributes?:Record<string,any>;
}

type preAssessmentType={
    [key in elementType]: preAssessmentElement
}

export const preAssessmentElements:preAssessmentType={
    richText:richTextElement,
    singleChoice:singleChoiceElement,
}
