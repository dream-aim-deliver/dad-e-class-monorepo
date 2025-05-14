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
    fileUrls: {
        fileName: string,
        url: string,
        fileSize: number,
      }[]
    
}

export  type DownloadFiles= DownloadFilesEdit | DownloadFilesPreview


export interface LinkLessonEdit extends BaseCourseElement {
    links: Array<{
        title: string;
        url: string;
    }>,
    include_in_materials: boolean
    customIcon: string


}

export interface LinkLessonPreview extends BaseCourseElement {
    links: Array<{
        title: string;
        url: string;
        file: string | null;
    }>;
}

export interface UplaodFileType extends BaseCourseElement {
    description: string,
    student_uploaded_files: (UploadResponse & {
        url: string,
        uploaded_at: string,
    })[],
    student_comment: string
}