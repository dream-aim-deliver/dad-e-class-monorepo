import { CourseElementType } from "../course-builder/types";
import { getValidationError as getRichTextValidationError } from "../lesson-components/rich-text";
import { getValidationError as getOneOutOfThreeValidationError } from "../lesson-components/one-out-of-three";
import { getValidationError as getSingleChoiceValidationError } from "../lesson-components/single-choice";
import { getValidationError as getMultiCheckValidationError } from "../lesson-components/multi-check";
import { getValidationError as getTextInputValidationError } from "../lesson-components/text-input";
import { getValidationError as getHeadingTextValidationError } from "../lesson-components/heading-lesson";
import { getValidationError as getUploadFilesFormValidationError } from "../lesson-components/upload-files";
import { getValidationError as getVideoValidationError } from "../course-builder-lesson-component/video";
import { getValidationError as getImageValidationError } from "../course-builder-lesson-component/image";
import { getValidationError as getImageGalleryValidationError } from "../course-builder-lesson-component/image-gallery";
import { getValidationError as getLinksValidationError } from "../course-builder-lesson-component/links";
import { getValidationError as getDownloadFilesValidationError } from "../course-builder-lesson-component/download-files-lesson";
import { getValidationError as getUploadFilesValidationError } from "../course-builder-lesson-component/upload-files-lesson";
import { getValidationError as getQuizValidationError } from "../course-builder-lesson-component/quiz";
import { getValidationError as getCoachingSessionValidationError } from '../course-builder-lesson-component/coaching-session';
import { getValidationError as getAssignmentValidationError } from '../course-builder-lesson-component/assignment';
import { FormElementType } from "../pre-assessment/types";
import { ElementValidator } from "./types";

export const validatorPerType: Record<CourseElementType | FormElementType, ElementValidator> = {
    [CourseElementType.CoachingSession]: getCoachingSessionValidationError,
    [CourseElementType.ImageFile]: getImageValidationError,
    [CourseElementType.VideoFile]: getVideoValidationError,
    [CourseElementType.ImageGallery]: getImageGalleryValidationError,
    [CourseElementType.DownloadFiles]: getDownloadFilesValidationError,
    [CourseElementType.UploadFiles]: getUploadFilesValidationError,
    [CourseElementType.Assignment]: getAssignmentValidationError,
    [CourseElementType.QuizTypeOne]: getQuizValidationError,
    [CourseElementType.QuizTypeTwo]: getQuizValidationError,
    [CourseElementType.QuizTypeThree]: getQuizValidationError,
    [CourseElementType.QuizTypeFour]: getQuizValidationError,
    [CourseElementType.Links]: getLinksValidationError,
    [FormElementType.RichText]: getRichTextValidationError,
    [FormElementType.SingleChoice]: getSingleChoiceValidationError,
    [FormElementType.MultiCheck]: getMultiCheckValidationError,
    [FormElementType.TextInput]: getTextInputValidationError,
    [FormElementType.HeadingText]: getHeadingTextValidationError,
    [FormElementType.OneOutOfThree]: getOneOutOfThreeValidationError,
    [FormElementType.UploadFiles]: getUploadFilesFormValidationError
}