import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";
import { assignment, fileMetadata, shared } from "@maany_shr/e-class-models";
import type {
    TAssignmentReplyResponse,
    TAssignmentPassedResponse,
} from '@dream-aim-deliver/e-class-cms-rest';

interface BaseCourseFormElement {
    type: CourseElementType;
    id: string;
    required?: boolean;
}

export interface CoachingSession {
    id?: number | string;
    name: string;
    duration: number;
}

export interface CoachingSessionElement extends BaseCourseFormElement {
    type: CourseElementType.CoachingSession;
    coachingSession?: CoachingSession;
    progress?: {
        session: {
            id: number | string;
            status: string;
        }
    }
}

export type QuizType = "quizTypeOne" | "quizTypeTwo" | "quizTypeThree" | "quizTypeFour";

export interface FileProps {
    onFilesChange: (files: fileMetadata.TFileUploadRequest[], abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (fileId: string, index: number) => void;
    onFileDownload: (id: string) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata, index: number) => void;
}

type ImageFileMetadata = fileMetadata.TFileMetadata & { category: 'image' };

export interface LinksElement extends BaseCourseFormElement {
    type: CourseElementType.Links;
    links: shared.TLink[];
    includeInMaterials?: boolean;
}

export interface QuizTypeOneElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeOne;
    title: string;
    description: string;
    imageFile: ImageFileMetadata | null;
    options: {
        id: string;
        name: string;
        correct?: boolean;
    }[];
    correctOptionId?: string;
}

export interface QuizTypeTwoElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeTwo;
    title: string;
    description: string;
    imageFile: ImageFileMetadata | null;
    groups: {
        id: string;
        title: string;
        options: {
            id: string;
            name: string;
            correct?: boolean;
        }[];
        correctOptionId?: string;
    }[];
}

export interface QuizTypeThreeElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeThree;
    title: string;
    description: string;
    options: {
        id: string;
        imageFile: ImageFileMetadata | null;
        description: string;
        correct: boolean;
    }[];
    correctOptionId?: string;
}

export interface QuizTypeFourElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeFour;
    title: string;
    description: string;
    labels: {
        letter: string;
        description: string;
    }[];
    images: {
        correctLetter: string;
        imageFile: ImageFileMetadata | null;
    }[];
}

export type DownloadFilesElement = {
    type: CourseElementType.DownloadFiles;
    files: fileMetadata.TFileMetadata[] | null;
} & BaseCourseFormElement;

export interface UploadFilesElement extends BaseCourseFormElement {
    type: CourseElementType.UploadFiles;
    description?: string;
    files: fileMetadata.TFileMetadata[] | null;
    userComment?: string | null;
}

export type AssignmentReply = TAssignmentReplyResponse | TAssignmentPassedResponse;

export enum AssignmentStatus {
    NotStarted,
    AwaitingReview,
    AwaitingReviewLongTime,
    Passed
}

export interface AssignmentElement extends BaseCourseFormElement {
    type: CourseElementType.Assignment;
    title: string;
    description: string;
    files: fileMetadata.TFileMetadata[] | null;
    links: shared.TLink[];
    progress?: {
        status: AssignmentStatus;
        lastReply?: AssignmentReply;
    }
}

export type CoachingElement = CoachingSessionElement;

export interface ImageElement extends BaseCourseFormElement {
    type: CourseElementType.ImageFile;
    file: ImageFileMetadata | null;
}

type VideoFileMetadata = fileMetadata.TFileMetadata & { category: 'video' };
export interface VideoElement extends BaseCourseFormElement {
    type: CourseElementType.VideoFile;
    file: VideoFileMetadata | null;
};

export interface ImageGallery extends BaseCourseFormElement {
    type: CourseElementType.ImageGallery;
    images: ImageFileMetadata[] | null;
}
