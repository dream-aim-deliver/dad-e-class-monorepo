import { CourseElementType } from "../course-builder/types";

export interface BaseCourseElement {
    type: CourseElementType;
    order: number;
    id: string;
}




export interface ImageFileEdit extends BaseCourseElement {
    imageId: string,
    imageThumbnailUrl: string
}

export interface ImageFilePreview extends BaseCourseElement {
    imageUrl: string;
}

export type ImageFile = ImageFileEdit | ImageFilePreview;

export interface VideoFileEdit extends BaseCourseElement {
    videoId: string,
    videoThumbnailUrl: string
}

export interface VideoFilePreview extends BaseCourseElement {
    videoId: string
}
export type VideoFile = VideoFileEdit | VideoFilePreview;

export interface ImageGalleryEdit extends BaseCourseElement {
    imageId: string,
    imageThumbnailUrl: string
}

export interface  ImageGalleryPreview extends BaseCourseElement {
    imageUrls: string[];
}




