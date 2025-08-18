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

export interface TempQuizTypeOneElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeOne;
    title: string;
    description: string;
    imageFile: ImageFileMetadata | null;
    options: {
        id: number;
        name: string;
        correct?: boolean;
    }[];
    correctOptionId: number;
}

export interface TempQuizTypeTwoElement extends BaseCourseFormElement {
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
        }[];
        correctOptionId: number;
    }[];
}

export interface TempQuizTypeThreeElement extends BaseCourseFormElement {
    type: CourseElementType.QuizTypeThree;
    title: string;
    description: string;
    options: {
        id: number;
        imageFile: ImageFileMetadata | null;
        description: string;
    }[];
    correctOptionId: number;
}

export interface TempQuizTypeFourElement extends BaseCourseFormElement {
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

export interface QuizElementBase extends isLocalAware, BaseCourseFormElement {
    type: CourseElementType.Quiz;
    title: string;
    isUploading?: boolean;
    description: string;
    onTypeChange?: (type: QuizType) => void;
}

export interface QuizTypeOneElement extends QuizElementBase, FileProps {
    quizType: "quizTypeOne";
    error?: boolean;
    fileData: fileMetadata.TFileMetadata;
    options: {
        optionText: string;
        correct: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeOne";
        id: string;
        order: number;
        title: string;
        description: string;
        fileData: fileMetadata.TFileMetadata;
        options: {
            optionText: string;
            correct: boolean;
        }[];
    }) => void;
}

export interface QuizTypeTwoElement extends QuizElementBase, FileProps {
    quizType: "quizTypeTwo";
    error?: boolean;
    fileData: fileMetadata.TFileMetadata;
    groups: {
        groupTitle: string;
        options: {
            optionText: string;
            correct: boolean;
        }[];
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeTwo";
        id: string;
        order: number;
        title: string;
        description: string;
        fileData: fileMetadata.TFileMetadata;
        groups: {
            groupTitle: string,
            options: {
                optionText: string,
                correct: boolean,
            }[]
        }[]
    }) => void;
}

export interface QuizTypeThreeElement extends QuizElementBase, FileProps {
    quizType: "quizTypeThree";
    error?: boolean;
    options: {
        fileData: fileMetadata.TFileMetadata;
        description: string;
        correct: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeThree";
        id: string;
        order: number;
        title: string;
        description: string;
        options: {
            fileData: fileMetadata.TFileMetadata;
            description: string;
            correct: boolean;
        }[]
    }) => void;
}

export interface QuizTypeFourElement extends QuizElementBase, FileProps {
    quizType: "quizTypeFour";
    labels: {
        letter: string;
        description: string;
    }[];
    images: {
        correctLetter: string;
        fileData: fileMetadata.TFileMetadata;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeFour";
        id: string;
        order: number;
        title: string,
        description: string;
        labels: {
            letter: string;
            description: string;
        }[];
        images: {
            correctLetter: string;
            fileData: fileMetadata.TFileMetadata;
        }[]
    }) => void;
}

export interface QuizTypeOneStudentViewElement extends QuizElementBase {
    quizType: "quizTypeOne";
    imageId: string;
    imageThumbnailUrl: string;
    options: {
        optionText: string;
        correct: boolean;
        selected: boolean
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeOne";
        id: string;
        order: number;
        title: string;
        description: string;
        imageId: string;
        imageThumbnailUrl: string;
        options: {
            optionText: string;
            correct: boolean;
            selected: boolean;
        }[],
    }) => void;
}

export interface QuizTypeTwoStudentViewElement extends QuizElementBase {
    quizType: "quizTypeTwo";
    imageId: string;
    imageThumbnailUrl: string;
    groups: {
        groupTitle: string;
        options: {
            optionText: string;
            correct: boolean;
            selected: boolean
        }[];
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeTwo";
        id: string;
        order: number;
        title: string;
        description: string;
        imageId: string;
        imageThumbnailUrl: string;
        groups: {
            groupTitle: string;
            options: {
                optionText: string;
                correct: boolean;
                selected: boolean;
            }[]
        }[]
    }) => void;
}

export interface QuizTypeThreeStudentViewElement extends QuizElementBase {
    quizType: "quizTypeThree";
    options: {
        imageId: string;
        imageThumbnailUrl: string;
        description: string;
        correct: boolean;
        selected: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeThree",
        id: string;
        order: number;
        title: string;
        description: string;
        options: {
            imageId: string;
            imageThumbnailUrl: string;
            description: string;
            correct: boolean;
            selected: boolean;
        }[]
    }) => void;
}

export interface QuizTypeFourStudentViewElement extends QuizElementBase {
    quizType: "quizTypeFour";
    labels: {
        letter: string;
        description: string
    }[];
    images: {
        imageId: string;
        correctLetter: string;
        imageThumbnailUrl: string;
        userInput: string;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeFour";
        id: string;
        order: number;
        title: string;
        description: string;
        labels: {
            letter: string;
            description: string;
        }[],
        images: {
            imageId: string;
            correctLetter: string;
            imageThumbnailUrl: string;
            userInput: string;
        }[]
    }) => void;
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
    onFileCancel: (id: string) => void;
    onFileDelete: (id: string) => void;
};


export type CoachingElement = CoachingSessionTypes | CoachingSessionStudentViewTypes;

export type QuizElement =
    | QuizTypeOneElement
    | QuizTypeTwoElement
    | QuizTypeThreeElement
    | QuizTypeFourElement
    | QuizTypeOneStudentViewElement
    | QuizTypeTwoStudentViewElement
    | QuizTypeThreeStudentViewElement
    | QuizTypeFourStudentViewElement;

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
