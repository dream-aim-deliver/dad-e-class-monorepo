import { CourseElementType } from "../course-builder/types";
import { UploadResponse } from "../drag-and-drop/uploader";

/** Base interface for all course elements with common properties */
export interface BaseCourseElement {
    type: CourseElementType;
    order: number;
    id: string;
}

/** Interface for editing mode of downloadable files in a course */
export interface DownloadFilesEdit extends BaseCourseElement {
    files: UploadResponse[];
}

/** Interface for preview mode of downloadable files in a course */
export interface DownloadFilesPreview extends BaseCourseElement {
    fileUrls: UploadResponse[];
}

/** Type representing both edit and preview modes of downloadable files */
export type DownloadFiles = DownloadFilesEdit | DownloadFilesPreview

/** Interface for editing mode of link-based lessons */
export interface LinkLessonEdit extends BaseCourseElement {
    links: Array<{
        title: string;
        url: string;
    }>,
    includeInMaterials: boolean
    customIcon: string
}

/** Interface for preview mode of link-based lessons */
export interface LinkLessonPreview extends BaseCourseElement {
    links: Array<{
        title: string;
        url: string;
        file: string | null;
    }>;
}

/** Interface for coach's view of file upload component */
export interface UploadFileCoach extends BaseCourseElement {
    description: string,
}

/** Interface for student's view of file upload component with upload tracking */
export interface UploadFileStudent extends BaseCourseElement {
    description: string,
    studentUploadedFiles: (UploadResponse & {
        url: string,
        uploadedAt: string,
    })[],
    studentComment: string,
}

/** Type representing both coach and student views of file upload component */
export type UploadFileType = UploadFileCoach | UploadFileStudent;