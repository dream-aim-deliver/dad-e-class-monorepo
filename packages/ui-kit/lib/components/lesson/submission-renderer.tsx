import { isLocalAware } from "@maany_shr/e-class-translations";
import { FormElement } from "./types";
import { formElements } from "./form-element-core";

interface SubmissionRendererProps extends isLocalAware {
    elements: FormElement[];
}

export function SubmissionElementsRenderer({elements, locale}: SubmissionRendererProps) {
    return <div className="flex flex-col gap-4">
        {elements.map((elementInstance) => {
            const Element = formElements[elementInstance.type].submissionComponent;
            return (
                <div key={elementInstance.id.toString()} className="flex flex-col gap-2 items-start">
                    <Element
                        elementInstance={elementInstance}
                    />
                </div>
            );
        })}
    </div>
}
