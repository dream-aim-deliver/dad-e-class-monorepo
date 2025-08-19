import { isLocalAware } from "@maany_shr/e-class-translations";
import React from "react";
import { AssignmentElement, CoachingElement, ImageElement, ImageGallery, VideoElement, DownloadFilesElement, UploadFilesElement, TempQuizTypeOneElement, TempQuizTypeTwoElement, TempQuizTypeThreeElement, TempQuizTypeFourElement, LinksElement, CoachingSessionElement } from "../course-builder-lesson-component/types";
/**
 * Enum defining the types of course elements available in the course builder.
 * Each type represents a different kind of interactive element that can be added to a course.
 */
export enum CourseElementType {
    /** Represents a coaching session element */
    CoachingSession = "coachingSession",
    /** Represents a quiz element */
    Quiz = 'quiz',
    /** Represents an image file element */
    ImageFile = "ImageFile",
    /** Represents a video file element */
    VideoFile = "VideoFile",
    /** Represents an image gallery element */
    ImageGallery = "ImageGallery",
    /** Represents downloadable files element */
    DownloadFiles = "downloadFiles",
    UploadFiles = "uploadFiles",

    /** Represents an assignment element*/
    Assignment = "assignment",

    QuizTypeOne = "quizTypeOne",
    QuizTypeTwo = "quizTypeTwo",
    QuizTypeThree = "quizTypeThree",
    QuizTypeFour = "quizTypeFour",

    Links = "links",
}



/**
 * Union type representing all possible course element types.
 * Currently includes CoachingElement and QuizElement , AssignmentElement but can be extended for other element types.
 */
export type CourseElement = CoachingElement |
    TempQuizTypeOneElement |
    TempQuizTypeTwoElement |
    TempQuizTypeThreeElement |
    TempQuizTypeFourElement |
    LinksElement |
    DownloadFilesElement |
    UploadFilesElement |
    ImageElement |
    VideoElement |
    ImageGallery |
    AssignmentElement |
    CoachingSessionElement;

/**
 * Function type for submitting form values in the course builder.
 * @param key - The identifier key for the form field
 * @param value - The course element value being submitted
 */
export type SubmitFunction = (key: string, value: CourseElement) => void;

/**
 * Props for designer button components in the course builder interface.
 * These buttons are used to add new elements to the course.
 */
export interface DesignerButtonProps {
    /** The icon component to display on the button */
    icon: React.ElementType;
    /** The text label to display on the button */
    label: string;
}


/**
 * Props for designer components that handle the visual representation
 * and interaction of course elements in the course builder interface.
 * Extends isLocalAware for internationalization support.
 */
export interface DesignerComponentProps extends isLocalAware {
    /** The course element instance being designed */
    elementInstance: CourseElement;
    /** Optional callback fired when the element should move up in order */
    onUpClick?: (id: string) => void;
    /** Optional callback fired when the element should move down in order */
    onDownClick?: (id: string) => void;
    /** Optional callback fired when the element should be deleted */
    onDeleteClick?: (id: string) => void;
}

/**
 * Props for form components that handle user input and data collection
 * for course elements. Extends isLocalAware for internationalization support.
 */
export interface FormComponentProps extends isLocalAware {
    /** The course element instance being configured */
    elementInstance: CourseElement;
    /** Optional function to submit form values */
    submitValue?: SubmitFunction;
}





/**
 * Type alias for form input values.
 * Currently defined as string but can be extended for other value types.
 */
export type valueType = string

/**
 * Template interface that defines the structure for registering course elements.
 * Each course element type must implement this template to be usable in the course builder.
 */
export interface CourseElementTemplate {
    /** The type of course element this template represents */
    type: CourseElementType;
    /** Configuration for the designer button that creates this element */
    designerBtnElement: DesignerButtonProps;
    /** React component for rendering this element in the designer view */
    designerComponent: React.FC<DesignerComponentProps>;
    /** React component for rendering the form to configure this element */
    formComponent: React.FC<FormComponentProps>;
}

/**
 * Registry type that maps course element types to their corresponding templates.
 * This ensures type safety when accessing course element configurations.
 */
export type CourseElementRegistry = {
    [key in CourseElementType]: CourseElementTemplate;
};
