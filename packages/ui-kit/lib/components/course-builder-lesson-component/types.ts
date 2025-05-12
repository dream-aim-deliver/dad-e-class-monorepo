import { CourseElementType } from "../course-builder/types";

export interface BaseCourseElement {
    type: CourseElementType;
    order: number;
    id: string;
}




export interface ImageFileEdit extends BaseCourseElement {
    ImageId: string,
    imageThumbnailUrl: string
}

export interface ImageFilePreview extends BaseCourseElement {
    imageUrl: string;
}

export type ImageFile = ImageFileEdit | ImageFilePreview;

export interface VideoFileEdit extends BaseCourseElement {
    VideoId: string,
    VideoThumbnailUrl: string
}

export interface VideoFilePreview extends BaseCourseElement {
    VideoId: string
}
export type VideoFile = VideoFileEdit | VideoFilePreview;

export interface ImageGalleryEdit extends BaseCourseElement {
    ImageId: string,
    imageThumbnailUrl: string
}

export interface  ImageGalleryPreview extends BaseCourseElement {
    imageUrls: string[];
}




