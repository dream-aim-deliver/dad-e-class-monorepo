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
    TempQuizTypeOneElement,
    TempQuizTypeThreeElement,
    TempQuizTypeTwoElement,
} from '../course-builder-lesson-component/types';
import QuizTypeOne from '../quiz/quiz-type-one/quiz-type-one';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import DesignerLayout from '../designer-layout';
import { IconQuiz } from '../icons/icon-quiz';
import { fileMetadata } from '@maany_shr/e-class-models';
import QuizTypeTwo from '../quiz/quiz-type-two/quiz-type-two';
import QuizTypeThree from '../quiz/quiz-type-three/quiz-type-three';

const quizElement: CourseElementTemplate = {
    type: CourseElementType.Quiz,
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
                        element={elementInstance as TempQuizTypeOneElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                    />
                )}
                {quizType === 'quizTypeTwo' && (
                    <QuizTypeTwo
                        element={elementInstance as TempQuizTypeTwoElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                    />
                )}
                {quizType === 'quizTypeThree' && (
                    <QuizTypeThree
                        element={elementInstance as TempQuizTypeThreeElement}
                        locale={locale}
                        onChange={onChange}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        onFileDownload={onFileDownload}
                        onUploadComplete={onUploadComplete}
                        uploadError={uploadError}
                    />
                )}
            </div>
        </DesignerLayout>
    );
}

// Inline QuizPreview logic
// TODO: remove and instead use different types of elements
function formComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.Quiz) return null;

    const quizType = elementInstance.quizType as QuizType;
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
}: {
    children: React.ReactNode;
    locale: TLocale;
}) {
    const dictionary = getDictionary(locale);
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
