import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";
import { assignment, fileMetadata, shared } from "@maany_shr/e-class-models";

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

export interface CreateAssignmentBuilderViewTypes extends isLocalAware {
    type: CourseElementType.Assignment;
    id: number;
    order: number;
    assignmentId: number;
    assignmentData: assignment.TAssignmentBaseWithId;
    onChange: (updatedData: {
        type: CourseElementType.Assignment;
        id: number;
        order: number;
        assignmentData: assignment.TAssignmentBase;
    }) => void;
    onFilesChange: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onImageChange: (image: fileMetadata.TFileMetadata, abortSignal?: AbortSignal) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onFileDelete?: (id: string) => void;
    onFileDownload?: (id: string) => void;
    onLinkDelete: (id: number, linkId: number, type: 'link') => void;
    onLinkEdit?: (data: shared.TLink, id: number) => void;
    linkEditIndex: number | null;
    onClickEditLink: (index: number) => void;
    onClickAddLink: () => void;
};

export interface AssignmentBuilderViewTypes extends isLocalAware {
    type: CourseElementType.Assignment;
    id: number;
    order: number;
    assignmentData: assignment.TAssignmentBase;
    onFileDelete?: (id: string) => void;
    onFileDownload?: (id: string) => void;
    onCancel?: () => void;
};

export type CoachingElement = CoachingSessionTypes | CoachingSessionStudentViewTypes;
export type AssignmentElement = CreateAssignmentBuilderViewTypes | AssignmentBuilderViewTypes;