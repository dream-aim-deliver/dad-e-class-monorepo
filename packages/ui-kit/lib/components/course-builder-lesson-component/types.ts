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
    onDeserializationError: (message: string, error: Error) => void;
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
import { UploadedFileType, UploadResponse } from "../drag-and-drop/uploader";

export type QuizType = "quizTypeOne" | "quizTypeTwo" | "quizTypeThree" | "quizTypeFour";

export interface ImageProps {
    onFilesChange: (files: UploadedFileType[] , index?: number , setFile?: (Files: UploadedFileType[]) => void) => Promise<UploadResponse>;
    onFileDelete: (index?: number , setFile?: (Files: UploadedFileType[]) => void) => void;
    onFileDownload: (index?: number) => void;
}

export interface QuizElementBase extends isLocalAware {
    type: CourseElementType.Quiz;
    id: number;
    order: number;
    required?: boolean;
    title: string;
    isUploading?: boolean;
    description: string;
    onTypeChange: (type: QuizType) => void;
}

export interface QuizTypeOneElement extends QuizElementBase , ImageProps {
    quizType: "quizTypeOne"; 
    error?: boolean;
    imageId: string;
    imageThumbnailUrl: string;
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
        imageId: string;
        options: {
            optionText: string;
            correct: boolean;
        }[];
    }) => void;
}

export interface QuizTypeTwoElement extends QuizElementBase , ImageProps {
    quizType: "quizTypeTwo"; 
    error?: boolean;
    imageId: string;
    imageThumbnailUrl: string;
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
        imageId: string;
        groups: {
          title: string,
          options: {
            optionText: string,
            correct: boolean,
          }[]
        }[]
    }) => void;
}

export interface QuizTypeThreeElement extends QuizElementBase , ImageProps {
    quizType: "quizTypeThree"; 
    error?: boolean;
    options: {
        imageId: string;
        imageThumbnailUrl: string;
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
          imageId: string;
          imageThumbnailUrl: string;
          description: string;
          correct: boolean;
        }[]
    }) => void;
}

export interface QuizTypeFourElement extends QuizElementBase , ImageProps {
    quizType: "quizTypeFour"; 
    labels: { 
        letter: string; 
        description: string;
    }[];
    images: { 
        imageId: string; 
        correctLetter: string; 
        imageThumbnailUrl: string 
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
          imageId: string;
          correctLetter: string;
          imageThumbnailUrl: string;
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

export type QuizElementType =
    | QuizTypeOneElement
    | QuizTypeTwoElement
    | QuizTypeThreeElement
    | QuizTypeFourElement
    | QuizTypeOneStudentViewElement
    | QuizTypeTwoStudentViewElement
    | QuizTypeThreeStudentViewElement
    | QuizTypeFourStudentViewElement;
