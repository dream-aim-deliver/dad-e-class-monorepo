import { FormElementType, FormElementRegistry } from "./types";
import richTextElement from "./rich-text";
import singleChoiceElement from "./single-choice";
import textInputElement from "./text-input";

/**
 * Collection of all available form elements
 * @public
 */
export const formElements: FormElementRegistry = {
    [FormElementType.RichText]: richTextElement,
    [FormElementType.SingleChoice]: singleChoiceElement,
    [FormElementType.TextInput]: textInputElement,
}; 