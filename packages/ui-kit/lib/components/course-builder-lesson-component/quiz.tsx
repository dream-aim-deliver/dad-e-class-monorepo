import {
    CourseElement,
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';

// Inline QuizEdit dependencies
import { Dropdown } from '../dropdown';
import {
    QuizType,
    QuizTypeFourElement,
    QuizTypeOneElement,
    QuizTypeThreeElement,
    QuizTypeTwoElement,
} from '../course-builder-lesson-component/types';
import QuizTypeOne from '../quiz/quiz-type-one/quiz-type-one';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import DesignerLayout from '../designer-layout';
import { IconQuiz } from '../icons/icon-quiz';
import { fileMetadata } from '@maany_shr/e-class-models';
import QuizTypeTwo from '../quiz/quiz-type-two/quiz-type-two';
import QuizTypeThree from '../quiz/quiz-type-three/quiz-type-three';
import QuizTypeFour from '../quiz/quiz-type-four/quiz-type-four';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';
import { getValidationError as getQuizTypeOneValidationError } from '../quiz/quiz-type-one/quiz-type-one';
import { getValidationError as getQuizTypeTwoValidationError } from '../quiz/quiz-type-two/quiz-type-two';
import { getValidationError as getQuizTypeThreeValidationError } from '../quiz/quiz-type-three/quiz-type-three';
import { getValidationError as getQuizTypeFourValidationError } from '../quiz/quiz-type-four/quiz-type-four';

// Main validation function that routes to specific quiz type validators
export const getValidationError: ElementValidator = (props) => {
    const { elementInstance } = props;

    switch (elementInstance.type) {
        case CourseElementType.QuizTypeOne:
            return getQuizTypeOneValidationError(props);
        case CourseElementType.QuizTypeTwo:
            return getQuizTypeTwoValidationError(props);
        case CourseElementType.QuizTypeThree:
            return getQuizTypeThreeValidationError(props);
        case CourseElementType.QuizTypeFour:
            return getQuizTypeFourValidationError(props);
        default:
            return 'Unknown quiz type';
    }
};

const quizElement: CourseElementTemplate = {
    type: CourseElementType.QuizTypeOne,
    designerBtnElement: {
        icon: IconQuiz,
        label: 'Quiz',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: formComponent,
};

interface QuizDesignerComponentProps extends DesignerComponentProps {
    onTypeChange: (type: QuizType) => void;
    onChange: (element: Partial<CourseElement>) => void;
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (fileId: string, index: number) => void;
    onFileDownload: (id: string) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata, index: number) => void;
    uploadError: string | null;
    uploadProgress?: number;
}

const getQuizType = (elementInstance: CourseElement): QuizType | undefined => {
    if (elementInstance.type === CourseElementType.QuizTypeOne) {
        return 'quizTypeOne';
    }
    if (elementInstance.type === CourseElementType.QuizTypeTwo) {
        return 'quizTypeTwo';
    }
    if (elementInstance.type === CourseElementType.QuizTypeThree) {
        return 'quizTypeThree';
    }
    if (elementInstance.type === CourseElementType.QuizTypeFour) {
        return 'quizTypeFour';
    }
    return undefined;
};

export function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
    onTypeChange,
    onChange,
    onFileChange,
    onFileDelete,
    onFileDownload,
    onUploadComplete,
    uploadError,
    uploadProgress,
    validationError,
}: QuizDesignerComponentProps) {
    const quizType = getQuizType(elementInstance);
    if (!quizType) return null;

    const dictionary = getDictionary(locale);

    // Options for dropdown
    const typeOptions = [
        { label: dictionary.components.quiz.typeOneText, value: 'quizTypeOne' },
        { label: dictionary.components.quiz.typeTwoText, value: 'quizTypeTwo' },
        {
            label: dictionary.components.quiz.typeThreeText,
            value: 'quizTypeThree',
        },
        {
            label: dictionary.components.quiz.typeFourText,
            value: 'quizTypeFour',
        },
    ];

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.quiz.quizText}
            icon={<IconQuiz classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            validationError={validationError}
        >
            {/* Inline QuizEdit logic */}
            <div className="flex flex-col gap-4 mt-4 w-full">
                <Dropdown
                    type="simple"
                    options={typeOptions}
                    onSelectionChange={(selected) =>
                        onTypeChange(selected as QuizType)
                    }
                    text={{ simpleText: 'Select Quiz Type' }}
                    defaultValue={quizType}
                    className="w-fit"
                    buttonClassName="bg-base-neutral-700 border-base-neutral-600"
                />
                {quizType === 'quizTypeOne' && (
                    <QuizTypeOne
                        element={elementInstance as QuizTypeOneElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                        uploadProgress={uploadProgress}
                    />
                )}
                {quizType === 'quizTypeTwo' && (
                    <QuizTypeTwo
                        element={elementInstance as QuizTypeTwoElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                        uploadProgress={uploadProgress}
                    />
                )}
                {quizType === 'quizTypeThree' && (
                    <QuizTypeThree
                        element={elementInstance as QuizTypeThreeElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                        uploadProgress={uploadProgress}
                    />
                )}
                {quizType === 'quizTypeFour' && (
                    <QuizTypeFour
                        element={elementInstance as QuizTypeFourElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                        uploadProgress={uploadProgress}
                    />
                )}
            </div>
        </DesignerLayout>
    );
}

// Inline QuizPreview logic
// TODO: remove and instead use different types of elements
function formComponent({ elementInstance, locale }: FormComponentProps) {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
            <div className="flex gap-1 items-start pb-2 border-b-[1px] border-divider">
                <IconQuiz classNames="fill-base-white" size="6" />
                <p className="text-sm text-base-white leading-[150%] font-bold">
                    {dictionary.components.quiz.quizText}
                </p>
            </div>
        </div>
    );
}

export function FormComponentWrapper({
    children,
    locale,
    elementInstance,
}: {
    children: React.ReactNode;
    locale: TLocale;
    elementInstance: CourseElement;
}) {
    const dictionary = getDictionary(locale);

    // Check for validation errors if elementInstance is provided
    if (elementInstance) {
        const validationError = getValidationError({
            elementInstance,
            dictionary,
        });
        if (validationError) {
            return (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={dictionary.components.lessons.elementValidationText}
                    description={validationError}
                />
            );
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
            <div className="flex gap-1 items-start pb-2 border-b-[1px] border-divider">
                <IconQuiz classNames="fill-base-white" size="6" />
                <p className="text-sm text-base-white leading-[150%] font-bold">
                    {dictionary.components.quiz.quizText}
                </p>
            </div>
            {children}
        </div>
    );
}

export default quizElement;
