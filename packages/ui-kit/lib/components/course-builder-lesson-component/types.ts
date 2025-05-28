import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";

export interface LessonNoteBuilderViewType extends isLocalAware {
    type: CourseElementType.LessonNote;
    id: number;
    order: number;
    initialValue: string;
    onChange: (value: string) => boolean;
    children?: React.ReactNode;
    placeholder: string;
    onDeserializationError: (message: string, error: Error) => void;
};

export interface LessonNoteStudentViewType extends isLocalAware {
    type: CourseElementType.LessonNote;
    id: number;
    order: number;
    children: React.ReactNode;
    ModuleNumber: number;
    ModuleTitle: string;
};

export type LessonNoteType = LessonNoteBuilderViewType | LessonNoteStudentViewType;


export interface CoachingSessionTypes extends isLocalAware {
    type: CourseElementType.CoachingSession;
    id: number;
    order: number;
    coachingSessionTypes: {
        id: number;
        name: string;
        duration: number;  // in minutes
    }[];
    onChange: (updatedData: {
        type: CourseElementType.CoachingSession;
        id: number;
        order: number;
        coachingOfferingTypeId: number;
    }) => void;
};

export interface CoachingSessionStudentViewTypes extends isLocalAware {
    type: CourseElementType.CoachingSession;
    id: number;
    order: number;
    children: React.ReactNode;
    studentHadSessionBeforeInCourse: boolean;
};

export type CoachingElement = CoachingSessionTypes | CoachingSessionStudentViewTypes;