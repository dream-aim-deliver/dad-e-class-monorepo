import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";
import { FileMetadataVideoSchema, FileMetadataImageSchema } from '@maany_shr/e-class-models';

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


export interface ImageFile extends FileMetadataImageSchema  {
    type: CourseElementType.CoachingSession;
    id: number;
    order: number;
};

export interface VideoFile extends FileMetadataVideoSchema {
    type: CourseElementType.CoachingSession;
    id: number;
    order: number;
};

