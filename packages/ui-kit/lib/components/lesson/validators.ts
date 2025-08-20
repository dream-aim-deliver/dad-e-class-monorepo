import { CourseElementType } from "../course-builder/types";
import { getValidationError as getRichTextValidationError } from "../lesson-components/rich-text";
import { FormElementType } from "../pre-assessment/types";
import { ElementValidator } from "./types";

// TODO: add all validators
export const validatorPerType: Record<CourseElementType | FormElementType, ElementValidator> = {
    [CourseElementType.CoachingSession]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.ImageFile]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.VideoFile]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.ImageGallery]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.DownloadFiles]: function (): string | undefined {
        return undefined;
    },
    [CourseElementType.UploadFiles]: function (): string | undefined {
        return undefined;
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
    [CourseElementType.Links]: function (): string | undefined {
        return undefined;
    },
    [FormElementType.RichText]: function (props): string | undefined {
        return getRichTextValidationError(props);
    },
    [FormElementType.SingleChoice]: function (): string | undefined {
        return undefined;
    },
    [FormElementType.MultiCheck]: function (): string | undefined {
        return undefined;
    },
    [FormElementType.TextInput]: function (): string | undefined {
        return undefined;
    },
    [FormElementType.HeadingText]: function (): string | undefined {
        return undefined;
    },
    [FormElementType.OneOutOfThree]: function (): string | undefined {
        return undefined;
    }
}
