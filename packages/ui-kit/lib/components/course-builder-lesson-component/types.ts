import { CourseElementType } from "../course-builder/types";
import { UploadResponse } from "../drag-and-drop/uploader";

export interface BaseCourseElement {
    type: CourseElementType;
    order: number;
    id: string;
}

export interface DownloadFilesEdit extends BaseCourseElement {
    files: UploadResponse[];
}
export interface DownloadFilesPreview extends BaseCourseElement {
    fileUrls: UploadResponse[];
    
}

export  type DownloadFiles= DownloadFilesEdit | DownloadFilesPreview


export interface LinkLessonEdit extends BaseCourseElement {
    links: Array<{
        title: string;
        url: string;
    }>,
    includeInMaterials: boolean
    customIcon: string
}

export interface LinkLessonPreview extends BaseCourseElement {
    links: Array<{
        title: string;
        url: string;
        file: string | null;
    }>;
}

export interface UploadFileType extends BaseCourseElement {
    description: string,
    studentUploadedFiles: (UploadResponse & {
        url: string,
        uploadedAt: string,
    })[],
    studentComment: string,

}