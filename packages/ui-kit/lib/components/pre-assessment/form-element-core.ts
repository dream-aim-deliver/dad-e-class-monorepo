import { FormElementType, FormElementRegistry } from "./types";
import richTextElement from "../lesson-components/rich-text";
import singleChoiceElement from "../lesson-components/single-choice";
import textInputElement from "../lesson-components/text-input";
import multiCheckElement from "../lesson-components/multi-check";
import headingTextElement from "../lesson-components/heading-lesson";
import oneOutOfThreeElement from "../lesson-components/one-out-of-three";
import uploadFilesElement from "../lesson-components/upload-files";


/**
 * Collection of all available form elements
 * @public
 */
export const formElements: FormElementRegistry = {
    [FormElementType.RichText]: richTextElement,
    [FormElementType.SingleChoice]: singleChoiceElement,
    [FormElementType.TextInput]: textInputElement,
    [FormElementType.MultiCheck]: multiCheckElement,
    [FormElementType.HeadingText]: headingTextElement,
    [FormElementType.OneOutOfThree]: oneOutOfThreeElement,
    [FormElementType.UploadFiles]: uploadFilesElement,
};