import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";
import { fileMetadata } from '@maany_shr/e-class-models';

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


type ImageFileMetadata = fileMetadata.TFileMetadata & { category: 'image' };
export interface ImageFile extends ImageFileMetadata {
    type: CourseElementType.ImageFile;
    order: number;
}
type VideoFileMetadata = fileMetadata.TFileMetadata & { category: 'video' };
export interface VideoFile extends VideoFileMetadata {
    type: CourseElementType.VideoFile;
    order: number;
};

