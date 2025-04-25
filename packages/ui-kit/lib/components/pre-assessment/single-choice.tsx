
import React, { useEffect, useState } from "react";
import { IconSingleChoice } from "../icons/icon-single-choice";
import { preAssessmentElement,elementType, preAssessmentInstance, submitFunction } from "./index";
import SingleChoicePreview, { optionsType } from "../single-choice-preview";
import { serialize } from "../rich-text-element/serializer";
const type:elementType="singleChoice";
const singleChoiceElement:preAssessmentElement={
    type,
    designerBtnElement:{
        icon:IconSingleChoice,
        label:"Rich Text"
    },
    designerComponent:()=><div>Single Choice Designer</div>,
    formComponent:FormComponent,
    submissionComponent:()=><div>Single Choice Submission</div>,

}

export function FormComponent({elementInstance,submitValue}:{elementInstance:preAssessmentInstance,submitValue?:submitFunction}){
    const {extraAttributes} = elementInstance;
    console.log(elementInstance);
    const [options, setOptions] = useState<optionsType[]>([]);

    useEffect(()=>{
        setOptions(extraAttributes.content.options);
    },[]);

   function onChange(option: string) {
  setOptions((prevOptions) =>
    prevOptions?.map((opt) => ({
      ...opt,
      isSelected: opt.label === option,
    }))
  );
}
    return(<div className="text-text-primary flex flex-col gap-2">
        <SingleChoicePreview
        title={extraAttributes.content.title}
        options={options}
        onChange={(option)=>{
            console.log(option)
            onChange(option);

            submitValue?.(elementInstance.id,JSON.stringify(options));
        }}
        />
     

    </div>)
}

export default singleChoiceElement;