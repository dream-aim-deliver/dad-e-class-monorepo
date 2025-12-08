import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
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
    Button,
    DefaultLoading,
    DefaultError,
} from '@maany_shr/e-class-ui-kit';
import { FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { JSX, useEffect, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useFileUploadContext } from '../course/utils/file-upload';
import { useAssignmentView } from '../course/utils/assignment-view';
import { trpc } from '../../trpc/cms-client';
import { useListCoachesPresenter } from '../../hooks/use-coaches-presenter';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCourseSlug } from '../course/utils/course-slug-context';

export interface ComponentRendererProps {
    keyString: string;
    formElement: LessonElement;
    elementProgress: React.RefObject<Map<string, LessonElement>>;
    locale: TLocale;
}

function RichTextComponent({
    formElement,
    keyString: key,
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
    keyString: key,
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
    keyString: key,
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
    keyString: key,
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
    keyString: key,
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
    keyString: key,
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

function VideoComponent({
    formElement,
    keyString: key,
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

function ImageComponent({
    formElement,
    locale,
    keyString: key,
}: ComponentRendererProps) {
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
    keyString: key,
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
    keyString: key,
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
    keyString: key,
    locale,
    elementProgress,
}: ComponentRendererProps) {
    const element = formElement as UploadFilesElement;

    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(
        element.files || [],
    );

    useEffect(() => {
        const progressElement = elementProgress.current.get(
            element.id,
        ) as UploadFilesElement;
        if (!progressElement) return;
        elementProgress.current.set(element.id, {
            ...progressElement,
            files: files,
        });
    }, [files]);

    const { uploadFile, uploadError } = useFileUploadContext();

    const onFilesUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata | null> => {
        return uploadFile(fileRequest, element.id, abortSignal);
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
                const file = files.find((file) => file.id === id);
                if (!file) return;
                downloadFile(file.url, file.name);
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
                const progressElement = elementProgress.current.get(
                    formElement.id,
                ) as UploadFilesElement;
                if (!progressElement) return;
                elementProgress.current.set(progressElement.id, {
                    ...progressElement,
                    userComment: comment,
                });
            }}
        />
    );
}

function QuizTypeOneComponent({
    formElement,
    keyString: key,
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
    keyString: key,
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
    keyString: key,
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
    keyString: key,
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

function LinksComponent({
    formElement,
    keyString: key,
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

function CourseCoachList({ sessionId, lessonComponentId, returnTo }: { sessionId: number | string; lessonComponentId: string; returnTo?: string }) {
    const courseSlug = useCourseSlug();
    const session = useSession();
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({});
    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachesPresenter(setCoachesViewModel);
    // @ts-ignore
    presenter.present(coachesResponse, coachesViewModel);

    const coaches = useMemo(() => {
        if (!coachesViewModel || coachesViewModel.mode !== 'default') {
            return [];
        }

        const currentUserUsername = session.data?.user?.name;

        if (!currentUserUsername) {
            return coachesViewModel.data.coaches;
        }

        return coachesViewModel.data.coaches.filter((coach) => {
            if (coach.username === currentUserUsername) {
                return false;
            }
            return true;
        });
    }, [coachesViewModel, session]);

    if (!coachesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachesViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    // TODO: Implement "show more" functionality
    return (
        <div className="flex flex-col gap-4 w-full">
            {coaches.map((coach) => (
                <LessonCoachComponent
                    key={coach.username}
                    name={coach.name}
                    rating={coach.averageRating ?? 0}
                    imageUrl={coach.avatarUrl ?? ''}
                    numberOfRatings={coach.reviewCount}
                    description={coach.bio}
                    defaultCoach={true}
                    onClickProfile={() => {
                        // TODO: Implement profile click logic
                    }}
                    onClickBook={() => {
                        const url = `/coaches/${coach.username}/book?sessionId=${sessionId}&lessonComponentId=${lessonComponentId}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}${courseSlug ? `&courseSlug=${encodeURIComponent(courseSlug)}` : ''}`;
                        router.push(url);
                    }}
                    locale={locale}
                />
            ))}
        </div>
    );
}

function CoachingSessionComponent({
    formElement,
    keyString: key,
    locale,
}: ComponentRendererProps) {
    const element = formElement as CoachingSessionElement;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // This statement is needed for debugging
    console.log(
        'Rendering CoachingSessionComponent for element with ID:',
        element.id,
    );

    const getProgressContent = () => {
        if (!element.progress) {
            return (
                <span className="text-text-secondary">
                    Your course plan doesn&apos;t include coaching sessions.
                </span>
            );
        }
        if (element.progress.session.status === 'unscheduled') {
            // Construct the return URL from current location
            const currentSearch = searchParams.toString();
            const returnTo = pathname + (currentSearch ? `?${currentSearch}` : '');
            return <CourseCoachList sessionId={element.progress.session.id} lessonComponentId={element.id} returnTo={returnTo} />;
        }
        return (
            <div className="flex flex-col gap-4">
                <span className="text-text-secondary">
                    Your coaching session is scheduled.
                </span>
                <Button
                    variant="primary"
                    text="View coaching sessions"
                    onClick={() => {
                        router.push('/workspace/coaching-sessions');
                    }}
                />
            </div>
        );
    };

    return (
        <CoachingSessionStudentView
            key={key}
            elementInstance={element}
            locale={locale}
            progressContent={getProgressContent()}
        />
    );
}

function AssignmentComponent({
    formElement,
    keyString: key,
    locale,
}: ComponentRendererProps) {
    const element = formElement as AssignmentElement;
    const viewService = useAssignmentView();

    return (
        <AssignmentFormComponent
            key={key}
            onFileDownload={(file) => {
                downloadFile(file.url, file.name);
            }}
            viewButton={viewService.getComponent(element.id)}
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
