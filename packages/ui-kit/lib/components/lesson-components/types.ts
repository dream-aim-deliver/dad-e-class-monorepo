import { OneOutOfThreeData } from "../out-of-three/one-out-of-three";
import { FormElementType } from "../pre-assessment/types";
import { fileMetadata } from "@maany_shr/e-class-models";

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
    id: string;
    required?: boolean; // Changed from required:true to optional boolean
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
    includeInMaterials?: boolean;
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
    content?: string;
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
    id?: string;
    name: string;
    isSelected: boolean;
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
 *     { name: "Option 1",isSelected: false },
 *     { name: "Option 2",isSelected: false },
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
 * Heading element interface.
 * This element is used for displaying headings in the form.
 *
 * @property type - Must be FormElementType.HeadingText
 * @property heading - The heading text to display
 * @property headingType - The type of heading (e.g., h1, h2, etc.)
 *
 * @example
 * ```tsx
 * const heading: HeadingElement = {
 *   type: FormElementType.HeadingText,
 *   id: "heading-1",
 *   order: 4,
 *   heading: "Welcome to the Form",
 *   headingType: "h1"
 * };
 * ```
 */
export interface HeadingElement extends BaseFormElement {
    type: FormElementType.HeadingText;
    heading: string;
    headingType: string;
}


export interface MultiCheckElement extends BaseFormElement {
    type: FormElementType.MultiCheck;
    title: string;
    options: ChoiceOption[];
}

export interface OneOutOfThreeElement extends BaseFormElement {
    type: FormElementType.OneOutOfThree;

    data: OneOutOfThreeData;

}

/**
 * Upload Files element interface for pre-course assessment.
 * This element is used for file uploads in pre-assessment forms.
 *
 * @property type - Must be FormElementType.UploadFiles
 * @property description - Description text for the upload field
 * @property files - Array of uploaded files or null
 * @property userComment - Optional comment from the user
 *
 * @example
 * ```tsx
 * const uploadFiles: PreAssessmentUploadFilesElement = {
 *   type: FormElementType.UploadFiles,
 *   id: "upload-1",
 *   description: "Please upload your resume",
 *   files: null,
 * };
 * ```
 */
export interface PreAssessmentUploadFilesElement extends BaseFormElement {
    type: FormElementType.UploadFiles;
    description?: string;
    files: fileMetadata.TFileMetadata[] | null;
    userComment?: string | null;
}