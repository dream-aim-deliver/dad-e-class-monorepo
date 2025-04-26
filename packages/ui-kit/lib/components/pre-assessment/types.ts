import React from "react";

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
    /** Text input element for entering text */
    TextInput = "textInput",
}

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
export type SubmitFunction = (key: string, value: any) => void;

/**
 * Base interface for all form elements.
 * This interface defines the common properties that all form elements must have.
 * 
 * @property type - The type of the form element
 * @property order - The order in which the element appears in the form
 * @property id - A unique identifier for the element
 * 
 * @example
 * ```tsx
 * const baseElement: BaseFormElement = {
 *   type: FormElementType.RichText,
 *   order: 1,
 *   id: "element-1"
 * };
 * ```
 */
export interface BaseFormElement {
    type: FormElementType;
    order: number;
    id: string;
}

/**
 * Rich Text element interface.
 * This element is used for displaying formatted text content in the form.
 * 
 * @property type - Must be FormElementType.RichText
 * @property content - The rich text content to display
 * 
 * @example
 * ```tsx
 * const richText: RichTextElement = {
 *   type: FormElementType.RichText,
 *   id: "rich-text-1",
 *   order: 1,
 *   content: "Welcome to the form"
 * };
 * ```
 */
export interface RichTextElement extends BaseFormElement {
    type: FormElementType.RichText;
    content: string;
}

/**
 * Text Input element interface.
 * This element is used for text input in the form.
 * 
 * @property type - Must be FormElementType.TextInput
 * @property helperText - Text to display below the input field
 * 
 * @example
 * ```tsx
 * const textInput: TextInputElement = {
 *   type: FormElementType.TextInput,
 *   id: "text-input-1",
 *   order: 2,
 *   helperText: "Enter your name"
 * };
 * ```
 */
export interface TextInputElement extends BaseFormElement {
    type: FormElementType.TextInput;
    helperText: string;
}

/**
 * Option interface for choice elements.
 * This interface defines the structure of options in choice elements.
 * 
 * @property name - The name/label of the option
 * 
 * @example
 * ```tsx
 * const option: ChoiceOption = {
 *   name: "Option 1"
 * };
 * ```
 */
export interface ChoiceOption {
    name: string;
}

/**
 * Single Choice element interface.
 * This element is used for selecting one option from a list.
 * 
 * @property type - Must be FormElementType.SingleChoice
 * @property title - The title/question for the choice
 * @property options - Array of options to choose from
 * 
 * @example
 * ```tsx
 * const singleChoice: SingleChoiceElement = {
 *   type: FormElementType.SingleChoice,
 *   id: "choice-1",
 *   order: 3,
 *   title: "Select an option",
 *   options: [
 *     { name: "Option 1" },
 *     { name: "Option 2" }
 *   ]
 * };
 * ```
 */
export interface SingleChoiceElement extends BaseFormElement {
    type: FormElementType.SingleChoice;
    title: string;
    options: ChoiceOption[];
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
    | SingleChoiceElement;

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
 * 
 * @example
 * ```tsx
 * const designerProps: DesignerComponentProps = {
 *   elementInstance: {
 *     type: FormElementType.RichText,
 *     id: "rich-text-1",
 *     order: 1,
 *     content: "Welcome to the form"
 *   }
 * };
 * ```
 */
export interface DesignerComponentProps {
    elementInstance: FormElement;
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
export interface FormComponentProps {
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
 *   submissionComponent: SubmissionComponent
 * };
 * ```
 */
export interface FormElementTemplate {
    type: FormElementType;
    designerBtnElement: DesignerButtonProps;
    designerComponent: React.FC<DesignerComponentProps>;
    formComponent: React.FC<FormComponentProps>;
    submissionComponent: React.FC<SubmissionComponentProps>;
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
