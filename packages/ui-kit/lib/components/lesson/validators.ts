import { CourseElementType } from "../course-builder/types";
import { getValidationError as getRichTextValidationError } from "../lesson-components/rich-text";
import { getValidationError as getOneOutOfThreeValidationError } from "../lesson-components/one-out-of-three";
import { getValidationError as getSingleChoiceValidationError } from "../lesson-components/single-choice";
import { getValidationError as getMultiCheckValidationError } from "../lesson-components/multi-check";
import { getValidationError as getTextInputValidationError } from "../lesson-components/text-input";
import { getValidationError as getHeadingTextValidationError } from "../lesson-components/heading-lesson";
import { getValidationError as getVideoValidationError } from "../course-builder-lesson-component/video";
import { getValidationError as getImageValidationError } from "../course-builder-lesson-component/image";
import { getValidationError as getImageGalleryValidationError } from "../course-builder-lesson-component/image-gallery";
import { getValidationError as getLinksValidationError } from "../course-builder-lesson-component/links";
import { getValidationError as getDownloadFilesValidationError } from "../course-builder-lesson-component/download-files-lesson";
import { getValidationError as getUploadFilesValidationError } from "../course-builder-lesson-component/upload-files-lesson";
import { FormElementType } from "../pre-assessment/types";
import { ElementValidator } from "./types";

// TODO: add all validators
export const validatorPerType: Record<CourseElementType | FormElementType, ElementValidator> = {
    [CourseElementType.CoachingSession]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.ImageFile]: function (props): string | undefined {
        return getImageValidationError(props);
    },
    [CourseElementType.VideoFile]: function (props): string | undefined {
        return getVideoValidationError(props);
    },
    [CourseElementType.ImageGallery]: function (props): string | undefined {
        return getImageGalleryValidationError(props);
    },
    [CourseElementType.DownloadFiles]: function (props): string | undefined {
        return getDownloadFilesValidationError(props);
    },
    [CourseElementType.UploadFiles]: function (props): string | undefined {
        return getUploadFilesValidationError(props);
    },
    [CourseElementType.Assignment]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.QuizTypeOne]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.QuizTypeTwo]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.QuizTypeThree]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.QuizTypeFour]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.Links]: function (props): string | undefined {
        return getLinksValidationError(props);
    },
    [FormElementType.RichText]: function (props): string | undefined {
        return getRichTextValidationError(props);
    },
    [FormElementType.SingleChoice]: function (props): string | undefined {
        return getSingleChoiceValidationError(props);
    },
    [FormElementType.MultiCheck]: function (props): string | undefined {
        return getMultiCheckValidationError(props);
    },
    [FormElementType.TextInput]: function (props): string | undefined {
        return getTextInputValidationError(props);
    },
    [FormElementType.HeadingText]: function (props): string | undefined {
        return getHeadingTextValidationError(props);
    },
    [FormElementType.OneOutOfThree]: function (props): string | undefined {
        return getOneOutOfThreeValidationError(props);
    }
}
