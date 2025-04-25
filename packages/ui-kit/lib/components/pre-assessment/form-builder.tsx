import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { preAssessmentElements, preAssessmentInstance } from "./index";
import { useRef, useState } from "react";
import { Button } from "../button";
import Banner from "../banner";
import { IconLoaderSpinner } from "../icons/icon-loader-spinner";

interface FormBuilderProps extends isLocalAware {
    isLoading: boolean;
    isError: boolean;
    onSubmit: (PreAssessmentElement:Record<string,string>) => void;
    elements: preAssessmentInstance[];
   
}
export function FormBuilder({
    isLoading,
    isError,
    onSubmit,
    elements,
    locale
}: FormBuilderProps) {
    const dictionary=getDictionary(locale);

    const formValues = useRef<{ [key: string]: string }>({});

    const submitValue=(id:string,value:string)=>{
        formValues.current[id] = value;
    };
    const handleSubmit = (e) => {
        if (e) e.preventDefault(); // Prevent default form submission
        
        
        
        onSubmit(formValues.current);
      };
 return (
    <form onSubmit={handleSubmit} className="max-w-[560px] p-6 flex flex-col  gap-4 bg-card-fill  shadow-[0px_4px_12px_0px_base-neutral-950] border-1 rounded-medium border-card-stroke text-text-primary">
        <h3 >{dictionary.components.formBuilder.title}</h3>
        <div className="flex flex-col gap-4">
            {elements.map((elementInstance) => {
                const Element =preAssessmentElements[elementInstance.type].formComponent;
                
                return (
                    <Element
                        submitValue={submitValue}
                        key={elementInstance.id}
                        elementInstance={elementInstance}
                    />
                );
            }
            )}
        </div>
        <Banner
         style="warning"
         description={dictionary.components.formBuilder.alertText}
         />
      <div className="relative w-full">
        <Button 
        type="submit"
        variant="primary"
        className="w-full capitalize"

        disabled={isLoading}
        text={dictionary.components.formBuilder.submitText}
        />
       {isLoading && <IconLoaderSpinner  classNames="absolute left-[50%] top-[20%] animate-spin"/>}
        </div> 
    </form>
 )
}