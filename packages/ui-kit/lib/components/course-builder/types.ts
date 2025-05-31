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
 * It includes QuizElementType and any other element types that may be added in the future.
 * 
 */
export type courseElement = LessonNoteType | CoachingElement | QuizElementType;

export type SubmitFunction = (key: string, value: courseElement) => void;

export interface DesignerButtonProps {
    icon: React.ElementType;
    label: string;
}


export interface DesignerComponentProps extends isLocalAware {
    elementInstance: courseElement;
    onUpClick?: (id: string) => void;
    onDownClick?: (id: string) => void;
    onDeleteClick?: (id: string) => void;
}


export interface FormComponentProps extends isLocalAware {
    elementInstance: courseElement;
}




export type valueType = string

export interface CourseElementTemplate {
    type: CourseElementType;
    designerBtnElement: DesignerButtonProps;
    designerComponent: React.FC<DesignerComponentProps>;
    formComponent: React.FC<FormComponentProps>;
}


export type CourseElementRegistry = {
    [key in CourseElementType]: CourseElementTemplate;
};
