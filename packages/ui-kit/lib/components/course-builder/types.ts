import { isLocalAware } from "@maany_shr/e-class-translations";
import React from "react";
import { CoachingElement, LessonNoteType, QuizElementType } from "../course-builder-lesson-component/types";

export enum CourseElementType {
    LessonNote = "lessonNote",
    CoachingSession = "coachingSession",
    Quiz = "quiz",
}

/**
 * Type for course elements.
 * This type is a union of all possible course element types.
 * It includes LessonNoteType, CoachingElement, QuizElementType  and any other element types that may be added in the future.
 * 
 */

export type courseElement = LessonNoteType | CoachingElement | QuizElementType;

export type SubmitFunction = (key: string, value: courseElement) => void;

export interface DesignerButtonProps {
    icon: React.ElementType;
    label: string;
}

/**
 * Props passed to each course element's designer component.
 * These components are used in the UI builder to move, edit, or delete elements.
 * Inherits localization awareness via `isLocalAware`.
 */

export interface DesignerComponentProps extends isLocalAware {
    elementInstance: courseElement;
    onUpClick?: (id: string) => void;
    onDownClick?: (id: string) => void;
    onDeleteClick?: (id: string) => void;
}

/**
 * Props passed to each course element's form component.
 * These components are used for editing the properties/content of the element.
 * Also inherits localization support.
 */

export interface FormComponentProps extends isLocalAware {
    elementInstance: courseElement;
}

// Simple type alias for representing a string value, can be used for form fields, keys, etc.
export type valueType = string

/**
 * Template structure for registering a new course element type.
 * This provides metadata and associated components for the element.
 */

export interface CourseElementTemplate {
    type: CourseElementType;
    designerBtnElement: DesignerButtonProps;
    designerComponent: React.FC<DesignerComponentProps>;
    formComponent: React.FC<FormComponentProps>;
}

/**
 * A registry mapping each CourseElementType to its template.
 * This enables dynamically rendering and managing course elements in the builder.
 */

export type CourseElementRegistry = {
    [key in CourseElementType]: CourseElementTemplate;
};
