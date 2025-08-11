import { isLocalAware } from "@maany_shr/e-class-translations";
import { LessonElement } from "./types";
import { lessonElements } from "./element-core";

interface SubmissionRendererProps extends isLocalAware {
    elements: LessonElement[];
}

export function SubmissionElementsRenderer({elements, locale}: SubmissionRendererProps) {
    return <div className="flex flex-col gap-4">
        {elements.map((elementInstance) => {
<<<<<<< HEAD
            const Element = (lessonElements as any)[elementInstance.type].submissionComponent;
=======
            const Element = lessonElements[elementInstance.type].submissionComponent;
>>>>>>> 4d2b7300 (Decompose pre course assessment form and element renderer)
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
