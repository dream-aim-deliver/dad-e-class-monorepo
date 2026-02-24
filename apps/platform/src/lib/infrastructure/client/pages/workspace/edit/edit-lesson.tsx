'use client';

import {
    Banner,
    Breadcrumbs,
    CourseElementType,
    DefaultLoading,
    DownloadFilesElement,
    FormElementType,
    HeadingElement,
    IconCloudDownload,
    IconCloudUpload,
    IconCoachingSession,
    IconHeading,
    IconMultiChoice,
    IconOneOutOfThree,
    IconRichText,
    IconSingleChoice,
    IconTextInput,
    IconVideo,
    ImageElement,
    ImageGallery,
    LessonElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SingleChoiceElement,
    QuizTypeOneElement,
    TextInputElement,
    UploadFilesElement,
    VideoElement,
    DefaultError,
    validatorPerType,
    LinksElement,
    CoachingSessionElement,
    IconAssignment,
    AssignmentElement,
} from '@maany_shr/e-class-ui-kit';
import EditHeader from './components/edit-header';
import EditLayout from './components/edit-layout';
import { IconImage } from 'packages/ui-kit/lib/components/icons/icon-image';
import { IconImageGallery } from 'packages/ui-kit/lib/components/icons/icon-image-gallery';
import { IconLink } from 'packages/ui-kit/lib/components/icons/icon-link';
import { IconQuiz } from 'packages/ui-kit/lib/components/icons/icon-quiz';
import { LessonComponentButton } from './types';
import LessonComponentsBar from './components/lesson-components-bar';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { generateTempId } from './utils/generate-temp-id';
import dynamic from 'next/dynamic';
import {
    ComponentRendererProps,
    typeToRendererMap,
} from '../../common/component-renderers';
import { useLessonComponents } from './hooks/edit-lesson-hooks';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';
import { useSaveLesson } from './hooks/save-hooks';
import { FileUploadProvider } from '../../course/utils/file-upload';
import { AssignmentViewProvider } from '../../course/utils/assignment-view';
import { useSession } from 'next-auth/react';

interface EditLessonProps {
    lessonId: number;
}

/*
 This might not be significant for production builds,
 but in development mode there is a long delay before the component
 is rendered without using lazy loading.
 This ensures there is a loading indicator during the component's initial render.
 The issue most likely happens due to a lot of heavy component imports.
 We should test this in production and see if the issue persists.
*/
const LoadingComponent = () => {
    const locale = useLocale() as TLocale;
    return <DefaultLoading locale={locale} variant="minimal" />;
};

const EditLessonComponents = dynamic(() => import('./edit-lesson-components'), {
    loading: LoadingComponent,
    ssr: false,
});

function PreviewRenderer({
    components,
    elementProgress,
    locale,
}: {
    components: LessonElement[];
    elementProgress: React.RefObject<Map<string, LessonElement>>;
    locale: TLocale;
}) {
    const renderComponent = (formElement: LessonElement) => {
        const props: ComponentRendererProps = {
            formElement,
            elementProgress,
            locale,
            keyString: `component-${formElement.id}`,
        };

        const ComponentRenderer = typeToRendererMap[formElement.type];
        if (ComponentRenderer) {
            return (
                <ComponentRenderer
                    key={`component-renderer-${formElement.id}`}
                    {...props}
                />
            );
        }
        return null;
    };

    return (
        <AssignmentViewProvider mode="study" config={{ studentUsername: undefined }}>
            <FileUploadProvider mode="mock" config={{ lessonId: 0 }}>
                <div className="flex flex-col gap-4">
                    {components.map(renderComponent)}
                </div>
            </FileUploadProvider>
        </AssignmentViewProvider>
    );
}

export default function EditLesson({ lessonId }: EditLessonProps) {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);
    const router = useRouter();

    const lessonComponentsViewModel = useLessonComponents(lessonId);

    useEffect(() => {
        if (!lessonComponentsViewModel) return;
        if (lessonComponentsViewModel.mode !== 'default') return;

        setComponents(
            transformLessonComponents(
                lessonComponentsViewModel.data.components,
            ),
        );
        setCourseVersion(lessonComponentsViewModel.data.courseVersion);
        setLessonTitle(lessonComponentsViewModel.data.lessonTitle);
        setCourseTitle(lessonComponentsViewModel.data.courseTitle);
        setCourseSlug(lessonComponentsViewModel.data.courseSlug);
    }, [lessonComponentsViewModel]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [courseVersion, setCourseVersion] = useState<number | null>(null);
    const [lessonTitle, setLessonTitle] = useState<string>('');
    const [courseTitle, setCourseTitle] = useState<string>('');
    const [courseSlug, setCourseSlug] = useState<string>('');
    const { components, setComponents, saveLesson, isSaving } = useSaveLesson({
        lessonId,
        courseVersion,
        setCourseVersion,
        errorMessage,
        setErrorMessage,
    });

    const [isPreviewing, setIsPreviewing] = useState(false);
    const editLessonsTranslations = useTranslations('pages.editLesson');
    const breadcrumbTranslations = useTranslations('components.breadcrumbs');

    const breadcrumbItems = [
        {
            label: breadcrumbTranslations('home'),
            onClick: () => router.push(`/${locale}`),
        },
        {
            label: breadcrumbTranslations('workspace'),
            onClick: () => router.push(`/${locale}/workspace`)
        },
        {
            label: breadcrumbTranslations('courses'),
            onClick: () => router.push(`/${locale}/workspace/courses`),
        },
        {
            label: courseTitle,
            onClick: () => router.push(`/${locale}/courses/${courseSlug}`),
        },
        {
            label: breadcrumbTranslations('editCourse'),
            onClick: () => router.push(`/${locale}/edit/course/${courseSlug}`),
        },
        {
            label: breadcrumbTranslations('editLesson'),
            onClick: () => {
                // Nothing should happen on clicking the current page
            },
        },
    ];

    const simpleComponentButtons: LessonComponentButton[] = [
        {
            icon: <IconRichText />,
            label: editLessonsTranslations('richText'),
            onClick: () => {
                const newComponent: RichTextElement = {
                    id: generateTempId(),
                    type: FormElementType.RichText,
                    content: '',
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconHeading size="6" />,
            label: editLessonsTranslations('heading'),
            onClick: () => {
                const newComponent: HeadingElement = {
                    id: generateTempId(),
                    type: FormElementType.HeadingText,
                    heading: '',
                    headingType: 'h1', // Default to h1
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconVideo />,
            label: editLessonsTranslations('video'),
            onClick: () => {
                const newComponent: VideoElement = {
                    id: generateTempId(),
                    type: CourseElementType.VideoFile,
                    file: null,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconImage />,
            label: editLessonsTranslations('image'),
            onClick: () => {
                const newComponent: ImageElement = {
                    id: generateTempId(),
                    type: CourseElementType.ImageFile,
                    file: null,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconImageGallery />,
            label: editLessonsTranslations('imageCarousel'),
            onClick: () => {
                const newComponent: ImageGallery = {
                    id: generateTempId(),
                    type: CourseElementType.ImageGallery,
                    images: [],
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconLink />,
            label: editLessonsTranslations('link'),
            onClick: () => {
                const newComponent: LinksElement = {
                    id: generateTempId(),
                    type: CourseElementType.Links,
                    links: [],
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconCloudDownload />,
            label: editLessonsTranslations('downloadFile'),
            onClick: () => {
                const newComponent: DownloadFilesElement = {
                    id: generateTempId(),
                    type: CourseElementType.DownloadFiles,
                    files: [],
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
    ];

    const interactiveComponentButtons: LessonComponentButton[] = [
        {
            icon: <IconTextInput />,
            label: editLessonsTranslations('textInput'),
            onClick: () => {
                const newComponent: TextInputElement = {
                    id: generateTempId(),
                    type: FormElementType.TextInput,
                    helperText: '',
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconCloudUpload />,
            label: editLessonsTranslations('uploadFiles'),
            onClick: () => {
                const newComponent: UploadFilesElement = {
                    id: generateTempId(),
                    type: CourseElementType.UploadFiles,
                    description: '',
                    files: null,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconSingleChoice />,
            label: editLessonsTranslations('singleChoice'),
            onClick: () => {
                const newComponent: SingleChoiceElement = {
                    id: generateTempId(),
                    type: FormElementType.SingleChoice,
                    title: '',
                    options: [],
                    required: false,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconMultiChoice />,
            label: editLessonsTranslations('checklist'),
            onClick: () => {
                const newComponent: MultiCheckElement = {
                    id: generateTempId(),
                    type: FormElementType.MultiCheck,
                    title: '',
                    options: [],
                    required: false,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconOneOutOfThree />,
            label: editLessonsTranslations('oneOutOfThree'),
            onClick: () => {
                const newComponent: OneOutOfThreeElement = {
                    id: generateTempId(),
                    type: FormElementType.OneOutOfThree,
                    data: {
                        tableTitle: '',
                        rows: [],
                        columns: []
                    },
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconQuiz />,
            label: editLessonsTranslations('quiz'),
            onClick: () => {
                const newComponent: QuizTypeOneElement = {
                    id: generateTempId(),
                    type: CourseElementType.QuizTypeOne,
                    title: '',
                    description: '',
                    imageFile: null,
                    options: [],
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconCoachingSession />,
            label: editLessonsTranslations('coachingSession'),
            onClick: () => {
                const newComponent: CoachingSessionElement = {
                    id: generateTempId(),
                    type: CourseElementType.CoachingSession,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconAssignment />,
            label: 'Assignment',
            onClick: () => {
                const newComponent: AssignmentElement = {
                    id: generateTempId(),
                    type: CourseElementType.Assignment,
                    title: '',
                    description: '',
                    files: [],
                    links: [],
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
    ];

    const [validationErrors, elementValidationErrors] = useState<
        Map<string, string | undefined>
    >(new Map());

    const onSave = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        const newErrors = new Map<string, string | undefined>();
        components.forEach((component) => {
            const validate = validatorPerType[component.type];
            if (validate) {
                const error = validate({
                    elementInstance: component,
                    dictionary,
                });
                if (error) {
                    newErrors.set(component.id, error);
                }
            }
        });
        elementValidationErrors(newErrors);
        if (newErrors.size > 0) {
            return;
        }

        try {
            const result = await saveLesson();
            if (result) {
                setSuccessMessage(editLessonsTranslations('saveSuccess'));
                setTimeout(() => setSuccessMessage(null), 5000);
            }
        } catch {
            // Error already set by saveLesson() via setErrorMessage
        }
    };

    // As we don't need to track progress, leave this map empty
    const elementProgress = useRef(new Map<string, LessonElement>());

    if (!lessonComponentsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (lessonComponentsViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={editLessonsTranslations('error.title')}
                description={editLessonsTranslations('error.description')}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4 px-15">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mb-4">
                <EditHeader
                    title={`${editLessonsTranslations('editLessonTitle')}: ${lessonTitle}`}
                    courseTitle={courseTitle}
                    onPreview={() => {
                        setIsPreviewing((prev) => !prev);
                    }}
                    onSave={onSave}
                    disablePreview={false}
                    isSaving={isSaving}
                    isPreviewing={isPreviewing}
                    locale={locale}
                    roles={[]}
                    slug=""
                />
            </div>
            {successMessage && (
                <Banner
                    style="success"
                    title={successMessage}
                    closeable
                    onClose={() => setSuccessMessage(null)}
                />
            )}
            {errorMessage && (
                <Banner
                    style="error"
                    title={editLessonsTranslations('errorSaving')}
                    description={errorMessage}
                    closeable
                    onClose={() => setErrorMessage(null)}
                />
            )}
            {isPreviewing && (
                <PreviewRenderer
                    components={components}
                    elementProgress={elementProgress}
                    locale={locale}
                />
            )}
            {!isPreviewing && (
                <EditLayout
                    panel={
                        <LessonComponentsBar
                            simpleComponentButtons={simpleComponentButtons}
                            interactiveComponentButtons={
                                interactiveComponentButtons
                            }
                            locale={locale}
                        />
                    }
                    editor={
                        <Suspense
                            fallback={
                                <DefaultLoading
                                    locale={locale}
                                    variant="minimal"
                                />
                            }
                        >
                            <EditLessonComponents
                                lessonId={lessonId}
                                components={components}
                                setComponents={setComponents}
                                courseVersion={courseVersion}
                                setCourseVersion={setCourseVersion}
                                validationErrors={validationErrors}
                            />
                        </Suspense>
                    }
                />
            )}
        </div>
    );
}
