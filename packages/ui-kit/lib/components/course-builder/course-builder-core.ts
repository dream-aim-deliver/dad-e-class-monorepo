import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import quizElement from "../course-builder-lesson-component/quiz";
<<<<<<< HEAD
import imageGalleryElement from "../course-builder-lesson-component/image-gallery";
import imageFilesElement from "../course-builder-lesson-component/image";
import videoFileElement from "../course-builder-lesson-component/video";
=======
import downloadFilesElement from "../course-builder-lesson-component/download-files-lesson";
import uploadFilesElement from "../course-builder-lesson-component/upload-files-lesson";
>>>>>>> 36c3c5d (feat(translations): add new dictionary entries for file upload and download components)
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
    [CourseElementType.CoachingSession]: coachingSessionElement,
    [CourseElementType.Quiz]: quizElement,
<<<<<<< HEAD
    [CourseElementType.ImageFile]: imageFilesElement,
    [CourseElementType.VideoFile]: videoFileElement,
    [CourseElementType.ImageGallery]: imageGalleryElement
=======
[CourseElementType.UploadFiles]:uploadFilesElement,
[CourseElementType.DownloadFiles]:downloadFilesElement
>>>>>>> 36c3c5d (feat(translations): add new dictionary entries for file upload and download components)
};