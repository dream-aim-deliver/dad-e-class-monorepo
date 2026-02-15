import {
    assignment,
    fileMetadata,
    useCaseModels,
    viewModels,
} from '@maany_shr/e-class-models';
import {
    CoachingSessionElement,
    CoachingSessionStudentView,
    CourseElement,
    DownloadFilesFormComponent,
    HeadingFormComponent,
    ImageFormComponent,
    ImageGalleryFormComponent,
    LessonCoachComponent,
    LinksElement,
    LinksFormComponent,
    MultiCheckFormComponent,
    OneOutOfThreeFormComponent,
    QuizFormComponentWrapper,
    QuizTypeFourStudentView,
    QuizTypeOneStudentView,
    QuizTypeThreeStudentView,
    QuizTypeTwoStudentView,
    RichTextFormComponent,
    SingleChoiceFormComponent,
    QuizTypeFourElement,
    QuizTypeOneElement,
    QuizTypeThreeElement,
    QuizTypeTwoElement,
    TextInputFormComponent,
    UploadFilesElement,
    UploadFilesFormComponent,
    VideoFormComponent,
    AssignmentFormComponent,
    AssignmentElement,
    CourseElementType,
    downloadFile,
} from '@maany_shr/e-class-ui-kit';
import { FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { getLessonComponentsMap } from '../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { mockCoaches } from '../../../common/mocks/simple/coaches';
import { simulateUploadFile } from '../../../common/mocks/simple/upload-file';

export interface ComponentRendererProps {
    key: string;
    formElement: LessonElement;
    elementProgress: React.RefObject<Map<string, LessonElement>>;
    locale: TLocale;
}

function RichTextComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <RichTextFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            locale={locale}
        />
    );
}

function HeadingComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <HeadingFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            locale={locale}
        />
    );
}

function TextInputComponent({
    formElement,
    elementProgress,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <TextInputFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            locale={locale}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function SingleChoiceComponent({
    formElement,
    elementProgress,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <SingleChoiceFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
            locale={locale}
        />
    );
}

function MultiCheckComponent({
    formElement,
    elementProgress,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <MultiCheckFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
            locale={locale}
        />
    );
}

function OneOutOfThreeComponent({
    formElement,
    elementProgress,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <OneOutOfThreeFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
            locale={locale}
        />
    );
}

function VideoComponent({ formElement, key, locale }: ComponentRendererProps) {
    return (
        <VideoFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
        />
    );
}

function ImageComponent({ formElement, locale, key }: ComponentRendererProps) {
    return (
        <ImageFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
        />
    );
}

function ImageCarouselComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <ImageGalleryFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
        />
    );
}

function DownloadFilesComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    if (formElement.type !== CourseElementType.DownloadFiles) return null;
    return (
        <DownloadFilesFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
            onDownload={(id) => {
                const file = formElement.files?.find((file) => file.id === id);
                if (file) {
                    downloadFile(file.url, file.name);
                }
            }}
        />
    );
}

function UploadFilesComponent({
    formElement,
    key,
    locale,
    elementProgress,
}: ComponentRendererProps) {
    const element = formElement as UploadFilesElement;

    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(
        element.files || [],
    );

    useEffect(() => {
        elementProgress.current.set(element.id, {
            ...element,
            files: files,
        });
    }, [files]);

    const onFilesUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata | null> => {
        // TODO: Implement real file upload logic

        // Simulate file upload logic; for the preview we might want to leave this as is
        const mockFile = await simulateUploadFile(fileRequest.file);

        if (abortSignal?.aborted) return null;

        return mockFile;
    };

    return (
        <UploadFilesFormComponent
            key={key}
            elementInstance={element}
            locale={locale}
            files={files}
            onFilesUpload={onFilesUpload}
            onFileDelete={(id) => {
                setFiles((prev) => prev.filter((file) => file.id !== id));
            }}
            onFileDownload={(id) => {
                // TODO: Implement download logic
            }}
            onUploadComplete={(fileMetadata) => {
                setFiles((prev) => {
                    // Check if the file already exists to avoid duplicates
                    if (prev.some((file) => file.id === fileMetadata.id)) {
                        return prev;
                    }
                    // Add the new file to the list
                    return [...prev, fileMetadata];
                });
            }}
            onStudentCommentChange={(comment) => {
                elementProgress.current.set(element.id, {
                    ...element,
                    userComment: comment,
                });
            }}
        />
    );
}

function QuizTypeOneComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper
            locale={locale}
            key={key}
            elementInstance={formElement as QuizTypeOneElement}
        >
            <QuizTypeOneStudentView
                key={key}
                elementInstance={formElement as QuizTypeOneElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function QuizTypeTwoComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper
            locale={locale}
            key={key}
            elementInstance={formElement as QuizTypeTwoElement}
        >
            <QuizTypeTwoStudentView
                key={key}
                elementInstance={formElement as QuizTypeTwoElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function QuizTypeThreeComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper
            locale={locale}
            key={key}
            elementInstance={formElement as QuizTypeThreeElement}
        >
            <QuizTypeThreeStudentView
                key={key}
                elementInstance={formElement as QuizTypeThreeElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function QuizTypeFourComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper
            locale={locale}
            key={key}
            elementInstance={formElement as QuizTypeFourElement}
        >
            <QuizTypeFourStudentView
                key={key}
                elementInstance={formElement as QuizTypeFourElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function LinksComponent({ formElement, key, locale }: ComponentRendererProps) {
    return (
        <LinksFormComponent
            key={key}
            elementInstance={formElement as LinksElement}
            locale={locale}
        />
    );
}

// Mocked for the MVP
function CourseCoachList() {
    // TODO: This needs courseSlug passed to it. Maybe through a context?
    const locale = useLocale() as TLocale;

    // TODO: Implement fetching of coaches based on courseSlug
    const coaches = mockCoaches;

    // TODO: Implement "show more" functionality
    return (
        <div className="flex flex-col gap-4 w-full">
            {coaches.map((coach) => (
                <LessonCoachComponent
                    key={coach.username}
                    name={coach.name}
                    rating={coach.rating}
                    imageUrl={coach.imageUrl}
                    numberOfRatings={coach.numberOfRatings}
                    description={coach.description}
                    defaultCoach={true}
                    onClickProfile={() => {
                        // No-op: lesson preview component with mock coaches
                    }}
                    onClickBook={() => {
                        // No-op: lesson preview component with mock coaches
                    }}
                    locale={locale}
                />
            ))}
        </div>
    );
}

function CoachingSessionComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <CoachingSessionStudentView
            key={key}
            elementInstance={formElement as CoachingSessionElement}
            locale={locale}
            progressContent={<CourseCoachList />}
        />
    );
}

function AssignmentComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    const element = formElement as AssignmentElement;
    return (
        <AssignmentFormComponent
            key={key}
            onFileDownload={(file) => {
                downloadFile(file.url, file.name);
            }}
            elementInstance={formElement as AssignmentElement}
            locale={locale}
        />
    );
}

export const typeToRendererMap: Record<
    string,
    (props: ComponentRendererProps) => JSX.Element | null
> = {
    richText: RichTextComponent,
    headingText: HeadingComponent,
    textInput: TextInputComponent,
    multiCheck: MultiCheckComponent,
    singleChoice: SingleChoiceComponent,
    oneOutOfThree: OneOutOfThreeComponent,
    videoFile: VideoComponent,
    imageFile: ImageComponent,
    imageGallery: ImageCarouselComponent,
    downloadFiles: DownloadFilesComponent,
    uploadFiles: UploadFilesComponent,
    quizTypeOne: QuizTypeOneComponent,
    quizTypeTwo: QuizTypeTwoComponent,
    quizTypeThree: QuizTypeThreeComponent,
    quizTypeFour: QuizTypeFourComponent,
    links: LinksComponent,
    coachingSession: CoachingSessionComponent,
    assignment: AssignmentComponent,
};
