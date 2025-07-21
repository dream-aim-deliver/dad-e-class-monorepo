import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import quizElement from "../course-builder-lesson-component/quiz";
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
    [CourseElementType.CoachingSession]: coachingSessionElement,
    [CourseElementType.Quiz]: quizElement
};