import { isLocalAware } from "@maany_shr/e-class-translations";
import { CourseElementType } from "../course-builder/types";

export type QuizType = "quizTypeOne" | "quizTypeTwo" | "quizTypeThree" | "quizTypeFour";

export interface QuizElementBase {
    type: CourseElementType.Quiz;
    id: number;
    order: number;
    required?: boolean;
    title: string;
    description: string;
}

export interface QuizTypeOneElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeOne"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
    imageId: string;
    imageThumbnailUrl: string;
    options: { 
        optionText: string; 
        correct: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeOne"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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

export interface QuizTypeTwoElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeTwo"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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
        quizType: "quizTypeTwo"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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

export interface QuizTypeThreeElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeThree"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
    options: {
        imageId: string;
        imageThumbnailUrl: string;
        description: string;
        correct: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeThree"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
        id: number;
        order: number;
        title: string;
        description: string;
        options: {
          imageId: string;
          description: string;
          correct: boolean;
        }[]
    }) => void;
}

export interface QuizTypeFourElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeFour"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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
        quizType: "quizTypeFour"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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

export interface QuizTypeOnePreviewElement extends QuizElementBase ,isLocalAware {
    quizType: "quizTypeOne"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
    imageId: string;
    imageThumbnailUrl: string;
    options: { 
        optionText: string; 
        correct: boolean; 
        selected: boolean 
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeOne"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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

export interface QuizTypeTwoPreviewElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeTwo"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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
        quizType: "quizTypeTwo"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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

export interface QuizTypeThreePreviewElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeThree"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
    options: {
        imageId: string;
        imageThumbnailUrl: string;
        description: string;
        correct: boolean;
        selected: boolean;
    }[];
    onChange: (updatedData: {
        quizType: "quizTypeThree", // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
        id: number;
        order: number;
        title: string;
        description: string;
        options: {
            imageId: string;
            imageThumbnailUrl: string;
            description: string;
            correct: boolean;
            selected: boolean; // false by default unless student has interacted
        }[]
    }) => void;
}

export interface QuizTypeFourPreviewElement extends QuizElementBase , isLocalAware {
    quizType: "quizTypeFour"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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
        quizType: "quizTypeFour"; // This should be type instead of quizType but we are already using type for type like quiz , single choice etc.
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
    | QuizTypeOnePreviewElement
    | QuizTypeTwoPreviewElement
    | QuizTypeThreePreviewElement
    | QuizTypeFourPreviewElement;