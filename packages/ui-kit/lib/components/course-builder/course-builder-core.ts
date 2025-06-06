import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
[CourseElementType.CoachingSession]:coachingSessionElement
};