import {
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
    TempQuizTypeFourElement,
    TempQuizTypeOneElement,
    TempQuizTypeThreeElement,
    TempQuizTypeTwoElement,
    TextInputFormComponent,
    UploadFilesElement,
    UploadFilesFormComponent,
    VideoFormComponent,
} from '@maany_shr/e-class-ui-kit';
import { FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { Download } from 'lucide-react';
import { on } from 'events';

interface LessonFormProps {
    data: viewModels.TLessonComponentListSuccess;
}

interface ComponentRendererProps {
    key: string;
    formElement: LessonElement;
    elementProgress: React.RefObject<Map<string, LessonElement>>;
    component: useCaseModels.TLessonComponent;
    locale: TLocale;
}

function renderRichTextComponent({ formElement, key }: ComponentRendererProps) {
    return (
        <RichTextFormComponent
            key={key}
            elementInstance={formElement as FormElement}
        />
    );
}

function renderHeadingComponent({ formElement, key }: ComponentRendererProps) {
    return (
        <HeadingFormComponent
            key={key}
            elementInstance={formElement as FormElement}
        />
    );
}

function renderTextInputComponent({
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

function renderSingleChoiceComponent({
    formElement,
    elementProgress,
    key,
}: ComponentRendererProps) {
    return (
        <SingleChoiceFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function renderMultiCheckComponent({
    formElement,
    elementProgress,
    key,
}: ComponentRendererProps) {
    return (
        <MultiCheckFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function renderOneOutOfThreeComponent({
    formElement,
    elementProgress,
    key,
}: ComponentRendererProps) {
    return (
        <OneOutOfThreeFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function renderVideoComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <VideoFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
        />
    );
}

function renderImageComponent({
    formElement,
    locale,
    key,
}: ComponentRendererProps) {
    return (
        <ImageFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
        />
    );
}

function renderImageCarouselComponent({
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

function renderDownloadFilesComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <DownloadFilesFormComponent
            key={key}
            elementInstance={formElement as CourseElement}
            locale={locale}
            onDownload={(id) => {
                // TODO: Implement download logic
                // Integrate from create course
            }}
        />
    );
}

function renderUploadFilesComponent({
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockFile: fileMetadata.TFileMetadata = {
            id: Math.random().toString(36).substring(2, 15),
            name: fileRequest.file.name,
            size: fileRequest.file.size,
            url: 'https://example.com/mock-file-url',
            status: 'available',
            category: 'generic',
        };
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

function renderQuizTypeOneComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper locale={locale} key={key}>
            <QuizTypeOneStudentView
                key={key}
                elementInstance={formElement as TempQuizTypeOneElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function renderQuizTypeTwoComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper locale={locale} key={key}>
            <QuizTypeTwoStudentView
                key={key}
                elementInstance={formElement as TempQuizTypeTwoElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function renderQuizTypeThreeComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper locale={locale} key={key}>
            <QuizTypeThreeStudentView
                key={key}
                elementInstance={formElement as TempQuizTypeThreeElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function renderQuizTypeFourComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <QuizFormComponentWrapper locale={locale} key={key}>
            <QuizTypeFourStudentView
                key={key}
                elementInstance={formElement as TempQuizTypeFourElement}
                locale={locale}
            />
        </QuizFormComponentWrapper>
    );
}

function renderLinksComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <LinksFormComponent
            key={key}
            elementInstance={formElement as LinksElement}
            locale={locale}
        />
    );
}

function renderCoachingSessionComponent({
    formElement,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <CoachingSessionStudentView
            key={key}
            elementInstance={formElement as CoachingSessionElement}
            locale={locale}
            coachList={null}
        />
    );
}

const typeToRendererMap: Record<
    string,
    (props: ComponentRendererProps) => JSX.Element | null
> = {
    richText: renderRichTextComponent,
    heading: renderHeadingComponent,
    textInput: renderTextInputComponent,
    multipleChoice: renderMultiCheckComponent,
    singleChoice: renderSingleChoiceComponent,
    oneOutOfThree: renderOneOutOfThreeComponent,
    video: renderVideoComponent,
    image: renderImageComponent,
    imageCarousel: renderImageCarouselComponent,
    downloadFiles: renderDownloadFilesComponent,
    uploadFiles: renderUploadFilesComponent,
    quizTypeOne: renderQuizTypeOneComponent,
    quizTypeTwo: renderQuizTypeTwoComponent,
    quizTypeThree: renderQuizTypeThreeComponent,
    quizTypeFour: renderQuizTypeFourComponent,
    links: renderLinksComponent,
    coachingSession: renderCoachingSessionComponent,
};

export default function LessonForm({ data }: LessonFormProps) {
    const components = data.components;
    const locale = useLocale() as TLocale;

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    const elementProgress = useRef(new Map([...formElements]));

    const renderComponent = (component: useCaseModels.TLessonComponent) => {
        const formElement = formElements.get(component.id) as
            | FormElement
            | undefined;
        if (!formElement) return null;

        const props: ComponentRendererProps = {
            formElement,
            elementProgress,
            component,
            locale,
            key: `component-${component.id}`,
        };

        const renderer = typeToRendererMap[component.type];
        if (renderer) {
            return renderer(props);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {components.map(renderComponent)}
        </div>
    );
}
