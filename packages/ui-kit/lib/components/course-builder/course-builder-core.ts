import assignmentElement from "../course-builder-lesson-component/assignment";
import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import quizElement from "../course-builder-lesson-component/quiz";
import imageGalleryElement from "../course-builder-lesson-component/image-gallery";
import imageFilesElement from "../course-builder-lesson-component/image";
import videoFileElement from "../course-builder-lesson-component/video";
import downloadFilesElement from "../course-builder-lesson-component/download-files-lesson";
import uploadFilesElement from "../course-builder-lesson-component/upload-files-lesson";
import { CourseElementRegistry, CourseElementType } from "./types";
import linksElement from "../course-builder-lesson-component/links";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
    [CourseElementType.CoachingSession]: coachingSessionElement,
    [CourseElementType.Quiz]: quizElement,
    [CourseElementType.ImageFile]: imageFilesElement,
    [CourseElementType.VideoFile]: videoFileElement,
    [CourseElementType.ImageGallery]: imageGalleryElement,
    [CourseElementType.UploadFiles]: uploadFilesElement,
    [CourseElementType.DownloadFiles]: downloadFilesElement,
    [CourseElementType.Assignment]: assignmentElement,
    // Temporary elements for specific quiz types
    [CourseElementType.QuizTypeOne]: quizElement,
    [CourseElementType.QuizTypeTwo]: quizElement,
    [CourseElementType.QuizTypeThree]: quizElement,
    [CourseElementType.QuizTypeFour]: quizElement,
    [CourseElementType.Links]: linksElement,
};