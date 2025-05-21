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