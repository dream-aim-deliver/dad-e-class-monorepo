import { courseElements } from "../course-builder/course-builder-core";
import { CourseElementRegistry } from "../course-builder/types";
import { formElements } from "../pre-assessment/form-element-core";
import { FormElementRegistry } from "../pre-assessment/types";

type LessonElementRegistry = FormElementRegistry & CourseElementRegistry;

export const lessonElements: LessonElementRegistry = {
    ...formElements,
    ...courseElements
} as LessonElementRegistry
