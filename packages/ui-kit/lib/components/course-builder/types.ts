import { isLocalAware } from "@maany_shr/e-class-translations";
import React from "react";
import { Descendant } from "slate";
import { QuizElementType } from "../lesson-components/types";

export enum CourseElementType {
    Quiz = "quiz",
}








/**
 * Union type of all possible form elements.
 * This type represents any valid form element that can be used in the form.
 * 
 * @example
 * ```tsx
 * const element: FormElement = {
 *   type: FormElementType.RichText,
 *   id: "rich-text-1",
 *   order: 1,
 *   content: "Welcome to the form"
 * };
 * ```
 */
export type courseElement = QuizElementType;
/**
 * Function type for handling course element submissions.
 * This callback function is used when a course element's value changes or is submitted.
 * 
 * @param key - The unique identifier (id) of the course element being submitted
 * @param value - The updated course element with its new value/content
 * 
 * @example
 * ```tsx
 * const handleSubmit: SubmitFunction = (key, value) => {
 *   // Update the course element in state or send to server
 *   updateCourseElement(key, value);
 * };
 * ```
 */
export type SubmitFunction = (key: string, value: courseElement) => void;

/**
 * Interface for the designer button element.
 * This interface defines the properties of the button that appears in the form designer.
 * 
 * @property icon - The icon component to display
 * @property label - The text label for the button
 * 
 * @example
 * ```tsx
 * const buttonProps: DesignerButtonProps = {
 *   icon: IconRichText,
 *   label: "Add Rich Text"
 * };
 * ```
 */
export interface DesignerButtonProps {
    icon: React.ElementType;
    label: string;
}

/**
 * Interface for the designer component props.
 * This interface defines the props passed to the designer component of a form element.
 * 
 * @property elementInstance - The form element instance being designed
 * @property onUpClick - Optional callback for moving the element up
 * @property onDownClick - Optional callback for moving the element down
 * @property onDeleteClick - Optional callback for deleting the element
 * 
 * @example
 * ```tsx
 * const designerProps: DesignerComponentProps = {
 *   elementInstance: {
 *     type: FormElementType.RichText,
 *     id: "rich-text-1",
 *     order: 1,
 *     content: "Welcome to the form"
 *   },
 *   onUpClick: () => console.log("Move up"),
 *   onDownClick: () => console.log("Move down"),
 *   onDeleteClick: () => console.log("Delete")
 * };
 * ```
 */
export interface DesignerComponentProps extends isLocalAware {
    elementInstance: courseElement;
    onUpClick?: (id: number) => void;
    onDownClick?: (id: number) => void;
    onDeleteClick?: (id: number) => void;
}

/**
 * Interface for the form component props.
 * This interface defines the props passed to the form component of a form element.
 * 
 * @property elementInstance - The form element instance being rendered
 * @property submitValue - Optional callback for form submission
 * 
 * @example
 * ```tsx
 * const formProps: FormComponentProps = {
 *   elementInstance: {
 *     type: FormElementType.TextInput,
 *     id: "text-input-1",
 *     order: 2,
 *     helperText: "Enter your name"
 *   },
 *   submitValue: (key, value) => console.log(key, value)
 * };
 * ```
 */
export interface FormComponentProps extends isLocalAware {
    elementInstance: courseElement;
    submitValue?: SubmitFunction;
}


/**
 * Interface for the submission component props.
 * This interface defines the props passed to the submission component of a form element.
 * 
 * @property elementInstance - The form element instance being displayed
 * 
 * @example
 * ```tsx
 * const submissionProps: SubmissionComponentProps = {
 *   elementInstance: {
 *     type: FormElementType.SingleChoice,
 *     id: "choice-1",
 *     order: 3,
 *     title: "Selected option",
 *     options: [{ name: "Option 1" }]
 *   }
 * };
 * ```
 */


/**
 * Template for form elements.
 * This interface defines the structure of a form element template, which includes
 * the element type, designer button, and all necessary components.
 * 
 * @property type - The type of the form element
 * @property designerBtnElement - Properties for the designer button
 * @property designerComponent - Component for the designer view
 * @property formComponent - Component for the form view
 * @property submissionComponent - Component for the submission view
 * @property validate - Validation function for the form element
 * 
 * @example
 * ```tsx
 * const template: FormElementTemplate = {
 *   type: FormElementType.RichText,
 *   designerBtnElement: {
 *     icon: IconRichText,
 *     label: "Add Rich Text"
 *   },
 *   designerComponent: DesignerComponent,
 *   formComponent: FormComponent,
 *   submissionComponent: SubmissionComponent,
 *   validate: (element, value) => {
 *     // Implementation of validate function;
 *     return true || false;
 *   }
 * };
 * ```
 */


export type valueType = string

export interface CourseElementTemplate {
    type: CourseElementType;
    designerBtnElement: DesignerButtonProps;
    designerComponent: React.FC<DesignerComponentProps>;
    formComponent: React.FC<FormComponentProps>;
}

/**
 * Type mapping element types to their respective element definitions.
 * This type ensures that each form element type has a corresponding template.
 * 
 * @example
 * ```tsx
 * const registry: FormElementRegistry = {
 *   [FormElementType.RichText]: richTextTemplate,
 *   [FormElementType.SingleChoice]: singleChoiceTemplate,
 *   [FormElementType.TextInput]: textInputTemplate
 * };
 * ```
 */
export type CourseElementRegistry = {
    [key in CourseElementType]: CourseElementTemplate;
};
