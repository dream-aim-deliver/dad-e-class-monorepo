'use client';

import {
    ComponentCard,
    CourseElementType,
    DefaultLoading,
    DownloadFilesElement,
    FormElementType,
    HeadingElement,
    IconCloudDownload,
    IconCloudUpload,
    IconCoachingSession,
    IconHeading,
    IconModule,
    IconMultiChoice,
    IconOneOutOfThree,
    IconRichText,
    IconSingleChoice,
    IconTextInput,
    IconVideo,
    ImageElement,
    ImageGallery,
    LessonElement,
    RichTextElement,
    SingleChoiceElement,
    TextInputElement,
    UploadFilesElement,
    VideoElement,
} from '@maany_shr/e-class-ui-kit';
import EditHeader from './components/edit-header';
import EditLayout from './components/edit-layout';
import { IconImage } from 'packages/ui-kit/lib/components/icons/icon-image';
import { IconImageGallery } from 'packages/ui-kit/lib/components/icons/icon-image-gallery';
import { IconLink } from 'packages/ui-kit/lib/components/icons/icon-link';
import { IconQuiz } from 'packages/ui-kit/lib/components/icons/icon-quiz';
import { LessonComponentButton } from './types';
import LessonComponentsBar from './components/lesson-components-bar';
import { Suspense, useState } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import EditLessonComponents from './edit-lesson-components';

interface EditLessonProps {
    lessonId: number;
}

// Required to seamlessly integrate with the components
const generateTempId = () => {
    const randomId = crypto.randomUUID();
    return `temp-${randomId}`;
};

// TODO: Translate
export default function EditLesson({ lessonId }: EditLessonProps) {
    const locale = useLocale() as TLocale;
    const [components, setComponents] = useState<LessonElement[]>([]);
    const [courseVersion, setCourseVersion] = useState<number | null>(null);

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
            onClick: () => {},
        },
        {
            icon: <IconOneOutOfThree />,
            label: '1 out of 3',
            onClick: () => {},
        },
        {
            icon: <IconQuiz />,
            label: 'Quiz',
            onClick: () => {},
        },
        {
            icon: <IconCoachingSession />,
            label: 'Coaching Session',
            onClick: () => {},
        },
    ];

    console.log(components);

    return (
        <div className="flex flex-col gap-4">
            <EditHeader
                title="Edit lesson"
                onPreview={() => {
                    console.log('Preview clicked for lesson:', lessonId);
                }}
                onSave={() => {
                    console.log('Save clicked for lesson:', lessonId);
                }}
                disablePreview={false}
                isSaving={false}
            />
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
        </div>
    );
}
