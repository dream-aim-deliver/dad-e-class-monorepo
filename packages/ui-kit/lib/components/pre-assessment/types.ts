import React from "react";
import { Descendant } from "slate";
import { isLocalAware } from "@maany_shr/e-class-translations";
import { HeadingElement, multiCheckElement, OneOutOfThreeElement, RichTextElement, SingleChoiceElement, TextInputElement } from "../lesson-components/types";
import { HeadingType } from "../heading-type";
import { OneOutOfThreeData } from "../out-of-three/one-out-of-three";
import { optionsType } from "../single-choice";

/**
 * Enum representing the available form element types in the pre-assessment form builder.
 * Each type corresponds to a specific form element that can be used in the form.
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
export enum FormElementType {
    /** Rich text element for displaying formatted text content */
    RichText = "richText",
    /** Single choice element for selecting one option from a list */
    SingleChoice = "singleChoice",
    /** Multi choice element for selecting multiple options from a list */
    MultiCheck = "multiCheck",
    /** Text input element for entering text */
    TextInput = "textInput",
    HeadingText = "headingText",
    OneOutOfThree = "oneOutOfThree"

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
export type FormElement =
    | RichTextElement
    | TextInputElement
    | SingleChoiceElement |multiCheckElement | HeadingElement | OneOutOfThreeElement;

/**
 * Function type for handling form submissions.
 * This function is called when a form element's value changes.
 * 
 * @param key - The unique identifier of the form element
 * @param value - The submitted value from the form element
 * 
 * @example
 * ```tsx
 * const handleSubmit: SubmitFunction = (key, value) => {
 *   console.log(`Element ${key} submitted with value:`, value);
 * };
 * ```
 */
export type SubmitFunction = (key: string, value: FormElement) => void;

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
    elementInstance: FormElement;
    onUpClick?: (id: string) => void;
    onDownClick?: (id: string) => void;
    onDeleteClick?: (id: string) => void;
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
    elementInstance: FormElement;
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
export interface SubmissionComponentProps {
    elementInstance: FormElement;
}

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


export type valueType = string | optionsType[] | Descendant[]  | HeadingType | OneOutOfThreeData;

export interface FormElementTemplate {
    type: FormElementType;
    designerBtnElement: DesignerButtonProps;
    designerComponent: React.FC<DesignerComponentProps>;
    formComponent: React.FC<FormComponentProps>;
    submissionComponent: React.FC<SubmissionComponentProps>;
    validate: (element: FormElement, value: valueType) => boolean;
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
export type FormElementRegistry = {
    [key in FormElementType]: FormElementTemplate;
};
