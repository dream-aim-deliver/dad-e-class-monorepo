import downloadFilesElement from "../lesson-components/download-files";
import imageFilesElement from "../lesson-components/image-files";
import uploadFilesElement from "../lesson-components/upload-files";
import videoFileElement from "../lesson-components/video-file";
import { CourseElementRegistry, CourseElementType } from "./types";




/**
 * Collection of all available form elements
 * @public
 */
export const courseElements: CourseElementRegistry = {
   [CourseElementType.DownloadFiles]:downloadFilesElement,
    [CourseElementType.ImageFiles]:imageFilesElement,
    [CourseElementType.VideoFile]:videoFileElement,
    [CourseElementType.Links]: linkElement,
    [CourseElementType.uploadFile]: uploadFilesElement,
};