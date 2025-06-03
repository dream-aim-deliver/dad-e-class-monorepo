import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";


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