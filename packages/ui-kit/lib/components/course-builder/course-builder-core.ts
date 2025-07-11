import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import imageFilesElement from "../course-builder-lesson-component/image-uploader-lesson";
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
[CourseElementType.CoachingSession]:coachingSessionElement,
[CourseElementType.ImageFile]:imageFilesElement,
    // [CourseElementType.VideoFile]:videoFileElement,
    // [CourseElementType.ImageGallery]:imageGalleryElement
};