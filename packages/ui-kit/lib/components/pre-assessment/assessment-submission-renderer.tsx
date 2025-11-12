import { isLocalAware } from "@maany_shr/e-class-translations";
import { FormElement } from "./types";
import { formElements } from "./form-element-core";

interface AssessmentSubmissionRendererProps extends isLocalAware {
    elements: FormElement[];
}

/**
 * AssessmentSubmissionRenderer component for rendering submitted pre-course assessment answers.
 * This component displays a read-only view of the assessment form elements and their submitted values.
 * 
 * @param elements - Array of form elements to render
 * @param locale - The locale for translation and localization purposes
 * 
 * @example
 * ```tsx
 * <AssessmentSubmissionRenderer
 *   elements={submittedElements}
 *   locale="en"
 * />
 * ```
 */
export function AssessmentSubmissionRenderer({
    elements,
    locale,
}: AssessmentSubmissionRendererProps) {
    return (
        <div className="flex flex-col gap-4">
            {elements.map((elementInstance) => {
                // Get the element template from formElements registry
                const elementTemplate = formElements[elementInstance.type];
                
                // Check if element exists in registry and has submissionComponent
                if (!elementTemplate || !elementTemplate.submissionComponent) {
                    console.warn(
                        `No submission component found for form element type: ${elementInstance.type}`,
                    );
                    return null;
                }
                
                const Element = elementTemplate.submissionComponent;
                return (
                    <div
                        key={elementInstance.id.toString()}
                        className="flex flex-col gap-2 items-start"
                    >
                        <Element elementInstance={elementInstance} locale={locale} />
                    </div>
                );
            })}
        </div>
    );
}

