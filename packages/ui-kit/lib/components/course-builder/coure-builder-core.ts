import quizElement from "../course-builder-lesson-component/quiz";
import { CourseElementRegistry, CourseElementType } from "./types";




/**
 * Collection of all available form elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
   [CourseElementType.Quiz]: quizElement,
};