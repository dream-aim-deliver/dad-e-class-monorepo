import accordionElement from "../course-builder-lesson-component/accordion-lesson";
import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import quizElement from "../course-builder-lesson-component/quiz";
import imageGalleryElement from "../course-builder-lesson-component/image-gallery";
import imageFilesElement from "../course-builder-lesson-component/image";
import videoFileElement from "../course-builder-lesson-component/video";
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
    [CourseElementType.CoachingSession]: coachingSessionElement,
    [CourseElementType.Quiz]: quizElement,
    [CourseElementType.Accordion]:accordionElement,
    [CourseElementType.ImageFile]: imageFilesElement,
    [CourseElementType.VideoFile]: videoFileElement,
    [CourseElementType.ImageGallery]: imageGalleryElement
};