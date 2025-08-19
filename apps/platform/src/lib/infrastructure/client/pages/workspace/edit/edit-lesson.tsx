'use client';

import {
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
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { generateTempId } from './utils/generate-temp-id';
import dynamic from 'next/dynamic';
import {
    ComponentRendererProps,
    typeToRendererMap,
} from '../../common/component-renderers';
import { useLessonComponents } from './hooks/edit-lesson-hooks';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';

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
const EditLessonComponents = dynamic(() => import('./edit-lesson-components'), {
    loading: () => {
        const locale = useLocale() as TLocale;
        return <DefaultLoading locale={locale} />;
    },
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
            key: `component-${formElement.id}`,
        };

        const renderer = typeToRendererMap[formElement.type];
        if (renderer) {
            return renderer(props);
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-4">
            {components.map(renderComponent)}
        </div>
    );
}

// TODO: Translate
export default function EditLesson({ lessonId }: EditLessonProps) {
    const locale = useLocale() as TLocale;

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
    }, [lessonComponentsViewModel]);

    const [components, setComponents] = useState<LessonElement[]>([]);
    const [courseVersion, setCourseVersion] = useState<number | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);

    const simpleComponentButtons: LessonComponentButton[] = [
        {
            icon: <IconRichText />,
            label: 'Rich Text',
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
            icon: <IconHeading />,
            label: 'Heading',
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
            label: 'Video',
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
            label: 'Image',
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
            label: 'Image Carousel',
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
            label: 'Link',
            onClick: () => {},
        },
        {
            icon: <IconCloudDownload />,
            label: 'Download Files',
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
            label: 'Text Input',
            onClick: () => {
                const newComponent: TextInputElement = {
                    id: generateTempId(),
                    type: FormElementType.TextInput,
                    helperText: '',
                    isRequired: false,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconCloudUpload />,
            label: 'Upload Files',
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
            label: 'Single Choice',
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
            label: 'Checklist',
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
            label: '1 out of 3',
            onClick: () => {
                const newComponent: OneOutOfThreeElement = {
                    id: generateTempId(),
                    type: FormElementType.OneOutOfThree,
                    data: {
                        tableTitle: '',
                        rows: [],
                    },
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconQuiz />,
            label: 'Quiz',
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
            label: 'Coaching Session',
            onClick: () => {},
        },
    ];

    // As we don't need to track progress, leave this map empty
    const elementProgress = useRef(new Map<string, LessonElement>());

    if (!lessonComponentsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (lessonComponentsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <EditHeader
                title="Edit lesson"
                onPreview={() => {
                    setIsPreviewing((prev) => !prev);
                }}
                onSave={() => {
                    console.log('Save clicked for lesson:', lessonId);
                }}
                disablePreview={false}
                isSaving={false}
                isPreviewing={isPreviewing}
            />
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
                        />
                    }
                    editor={
                        <Suspense fallback={<DefaultLoading locale={locale} />}>
                            <EditLessonComponents
                                lessonId={lessonId}
                                components={components}
                                setComponents={setComponents}
                                courseVersion={courseVersion}
                                setCourseVersion={setCourseVersion}
                            />
                        </Suspense>
                    }
                />
            )}
        </div>
    );
}
