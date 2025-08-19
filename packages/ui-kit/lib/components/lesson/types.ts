import { CourseElement, CourseElementType } from "../course-builder/types";
import { FormElement, FormElementType } from "../pre-assessment/types";
import { valueType as preAssessmentValueType } from "../pre-assessment/types";
import { valueType as courseBuilderValueType } from "../course-builder/types";
import { TDictionary } from "@maany_shr/e-class-translations";

export const LessonElementType = {
    ...FormElementType,
    ...CourseElementType,
}
export type LessonElement = CourseElement | FormElement;

export type valueType = preAssessmentValueType | courseBuilderValueType;

 interface ValidationProps {
    elementInstance: LessonElement;
    dictionary: TDictionary;
}

export type ElementValidator = (props: ValidationProps) => string | undefined;
