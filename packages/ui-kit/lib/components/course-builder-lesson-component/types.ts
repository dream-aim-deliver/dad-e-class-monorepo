import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";
import { fileMetadata } from "@maany_shr/e-class-models";


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

export type downloadsFilesTypes =  {
    type: CourseElementType.DownloadFiles;
    files: fileMetadata.TFileMetadata[] | null;
    id: number;
    order: number;
};

export interface uploadCoachingTypes  {
    type: CourseElementType.UploadFiles;
     description: string;
    id: number;
    order: number;

}
export interface uploadStudentTypes{
    type: CourseElementType.UploadFiles;
    id: number;
    order: number;
    files: fileMetadata.TFileMetadata[] | null;
    comment: string;
}
export type uploadsFilesTypes = uploadCoachingTypes | uploadStudentTypes;
export type CoachingElement = CoachingSessionTypes | CoachingSessionStudentViewTypes;