import downloadFilesElement from "../course-builder-lesson-component/download-files";
import linkElement from "../course-builder-lesson-component/link-lesson";
import { CourseElementRegistry, CourseElementType } from "./types";
import uploadFilesElement from "../course-builder-lesson-component/upload-files";



/**
 * Collection of all available form elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
   [CourseElementType.DownloadFiles]:downloadFilesElement,
    [CourseElementType.Links]: linkElement,
    [CourseElementType.uploadFile]: uploadFilesElement,
};