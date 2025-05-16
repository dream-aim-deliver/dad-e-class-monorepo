import { isLocalAware } from "@maany_shr/e-class-translations";
import React from "react";
import {ImageFile, VideoFile, ImageGalleryEdit, ImageGalleryPreview } from "../course-builder-lesson-component/types";

/**
 * Enum representing the different types of course elements that can be used in the course builder.
 */
export enum CourseElementType {
    ImageFile = "ImageFile",
    VideoFile = "VideoFile",
    ImageGallery = "ImageGallery",
}

/**
 * Type for course elements.
 * This type is a union of all possible course element types.
 * It includes image files, video files, and image galleries.
 */
export type CourseElement = ImageFile | VideoFile | ImageGalleryEdit | ImageGalleryPreview;

/**
 * Function type for submitting course element values.
 * @param key - The identifier for the course element
 * @param value - The course element value to be submitted
 */
export type SubmitFunction = (key: string, value:  CourseElement) => void;

/**
 * Props interface for the designer button component.
 * Used to configure the appearance of element buttons in the course builder.
 */
export interface DesignerButtonProps {
    icon: React.ElementType;
    label: string;
}

/**
 * Props interface for the designer component.
 * Extends isLocalAware to support localization.
 * Provides properties for managing course element instances in the designer.
 */
export interface DesignerComponentProps extends isLocalAware {
    elementInstance:  CourseElement;
    onUpClick: (id: string) => void;
    onDownClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
}

/**
 * Props interface for the form component.
 * Extends isLocalAware to support localization.
 * Used to manage form state and submission for course elements.
 */
export interface FormComponentProps extends isLocalAware {
    elementInstance:  CourseElement;
    submitValue?: SubmitFunction;
}

/**
 * Basic value type for course elements.
 */
export type valueType = string;

/**
 * Template interface for course elements.
 * Defines the structure and components required for each course element type.
 */
export interface CourseElementTemplate {
    type: CourseElementType;
    designerBtnElement: DesignerButtonProps;
    designerComponent: React.FC<DesignerComponentProps>;
    formComponent: React.FC<FormComponentProps>;
}

/**
 * Registry type that maps CourseElementTypes to their corresponding templates.
 * Used to store and retrieve course element configurations.
 */
export type CourseElementRegistry = {
    [key in CourseElementType]: CourseElementTemplate;
};
