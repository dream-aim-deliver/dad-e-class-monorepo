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

export type QuizType = "quizTypeOne" | "quizTypeTwo" | "quizTypeThree" | "quizTypeFour";

export interface fileProps {
    onFilesChange: (files: fileMetadata.TFileUploadRequest[], abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (fileId: string, index: number) => void;
    onFileDownload: (id: string) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata, index: number) => void;
}

export interface QuizElementBase extends isLocalAware {
    type: CourseElementType.Quiz;
    id: number;
    order: number;
    required?: boolean;
    title: string;
    isUploading?: boolean;
    description: string;
    onTypeChange?: (type: QuizType) => void;
}

export interface QuizTypeOneElement extends QuizElementBase, fileProps {
    quizType: "quizTypeOne";
    error?: boolean;
    fileData: fileMetadata.TFileMetadata;
    options: {
        optionText: string;
        correct: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeOne";
        id: number;
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

export interface QuizTypeTwoElement extends QuizElementBase, fileProps {
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
        id: number;
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

export interface QuizTypeThreeElement extends QuizElementBase, fileProps {
    quizType: "quizTypeThree";
    error?: boolean;
    options: {
        fileData: fileMetadata.TFileMetadata;
        description: string;
        correct: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeThree";
        id: number;
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

export interface QuizTypeFourElement extends QuizElementBase, fileProps {
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
        id: number;
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
        id: number;
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
        id: number;
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
        id: number;
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
        id: number;
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

export type QuizElement =
    | QuizTypeOneElement
    | QuizTypeTwoElement
    | QuizTypeThreeElement
    | QuizTypeFourElement
    | QuizTypeOneStudentViewElement
    | QuizTypeTwoStudentViewElement
    | QuizTypeThreeStudentViewElement
    | QuizTypeFourStudentViewElement;

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

export interface ImageGallery {
    type: CourseElementType.ImageGallery;
    id: number;
    order: number;
    images: ImageFileMetadata[];
}


