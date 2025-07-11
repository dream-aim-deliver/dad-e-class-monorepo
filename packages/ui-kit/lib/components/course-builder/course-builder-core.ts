import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import quizElement from "../course-builder-lesson-component/quiz";
import imageFilesElement from "../course-builder-lesson-component/image-uploader-lesson";
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
    [CourseElementType.CoachingSession]: coachingSessionElement,
    [CourseElementType.Quiz]: quizElement,
    [CourseElementType.ImageFile]:imageFilesElement,
    //[CourseElementType.VideoFile]:videoFileElement,
    //[CourseElementType.ImageGallery]:imageGalleryElement
};