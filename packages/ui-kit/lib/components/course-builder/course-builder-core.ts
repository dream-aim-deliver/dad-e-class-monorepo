import coachingSessionElement from "../course-builder-lesson-component/coaching-session";
import downloadFilesElement from "../course-builder-lesson-component/download-files-lesson";
import uploadFilesElement from "../course-builder-lesson-component/upload-files-lesson";
import { CourseElementRegistry, CourseElementType } from "./types";


/**
 * Collection of all available Course elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
[CourseElementType.CoachingSession]:coachingSessionElement,
[CourseElementType.UploadFiles]:uploadFilesElement,
[CourseElementType.DownloadFiles]:downloadFilesElement
};