import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";
import { assignment, fileMetadata, shared } from "@maany_shr/e-class-models";

interface BaseCourseFormElement {
    type: CourseElementType;
    id: string;
    required?: boolean;
}

export interface CoachingSessionElement extends BaseCourseFormElement {
    type: CourseElementType.CoachingSession;
    coachingSession?: {
        id: number;
        name: string;
        duration: number;
    }
}

export interface CoachingSessionTypes extends isLocalAware, BaseCourseFormElement {
    type: CourseElementType.CoachingSession;
    coachingSessionTypes: {
        id: number;
        name: string;
        duration: number;  // in minutes
    }[];
    onChange: (updatedData: {
        type: CourseElementType.CoachingSession;
        id: string;
        order: number;
        coachingOfferingTypeId: number;
    }) => void;
};

export interface CoachingSessionStudentViewTypes extends isLocalAware, BaseCourseFormElement {
    type: CourseElementType.CoachingSession;
    children: React.ReactNode;
    studentHadSessionBeforeInCourse: boolean;
};

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
}

export interface QuizTypeOneElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeOne;
    title: string;
    description: string;
    imageFile: ImageFileMetadata | null;
    options: {
        id: number;
        name: string;
        correct?: boolean;
    }[];
    correctOptionId?: number;
}

export interface QuizTypeTwoElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeTwo;
    title: string;
    description: string;
    imageFile: ImageFileMetadata | null;
    groups: {
        id: number;
        title: string;
        options: {
            id: number;
            name: string;
            correct?: boolean;
        }[];
        correctOptionId?: number;
    }[];
}

export interface QuizTypeThreeElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeThree;
    title: string;
    description: string;
    options: {
        id: number;
        imageFile: ImageFileMetadata | null;
        description: string;
        correct: boolean;
    }[];
    correctOptionId?: number;
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

export type DownloadFilesElement =  {
    type: CourseElementType.DownloadFiles;
    files: fileMetadata.TFileMetadata[] | null;
} & BaseCourseFormElement;

export interface UploadFilesElement extends BaseCourseFormElement {
    type: CourseElementType.UploadFiles;
    description?: string;
    files: fileMetadata.TFileMetadata[] | null;
    userComment?: string;
}

export interface CreateAssignmentBuilderViewTypes extends isLocalAware, BaseCourseFormElement {
    type: CourseElementType.Assignment;
    assignmentData: assignment.TAssignmentBaseWithId;
    onChange: (updatedData: {
        type: CourseElementType.Assignment;
        id: string;
        order: number;
        assignmentData: assignment.TAssignmentBaseWithId;
    }) => void;
    onFilesChange: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onImageChange: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (id: string) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    onLinkDelete: (linkId: number) => void;
    onLinkEdit: (data: shared.TLink, id: number) => void;
    linkEditIndex: number | null;
    onClickEditLink: (index: number) => void;
    onClickAddLink: () => void;
};

export interface AssignmentBuilderViewTypes extends isLocalAware, BaseCourseFormElement {
    type: CourseElementType.Assignment;
    assignmentData: assignment.TAssignmentBaseWithId;
    onFileDownload: (id: string) => void;
};


export type CoachingElement = CoachingSessionTypes | CoachingSessionStudentViewTypes;

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


export type AssignmentElement = CreateAssignmentBuilderViewTypes | AssignmentBuilderViewTypes;
