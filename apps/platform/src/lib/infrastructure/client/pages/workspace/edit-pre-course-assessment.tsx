'use client';

import {
    Button,
    ComponentCard,
    DefaultError,
    DefaultLoading,
    FormElement,
    FormElementType,
    HeadingElement,
    IconHeading,
    IconMultiChoice,
    IconOneOutOfThree,
    IconRichText,
    IconSingleChoice,
    IconTextInput,
    LessonElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SectionHeading,
    SingleChoiceElement,
    SubsectionHeading,
    TextInputElement,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../../hooks/use-platform-language-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { LessonComponentButton } from './edit/types';
import { generateTempId } from './edit/utils/generate-temp-id';
import EditLessonComponents from './edit/edit-lesson-components';

function usePlatformLanguage() {
    const [
        platformLanguageResponse,
        {
            refetch: refetchPlatformLanguage,
            isRefetching: isRefetchingPlatformLanguage,
        },
    ] = trpc.getPlatformLanguage.useSuspenseQuery({});

    const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);

    const { presenter: platformLanguagePresenter } =
        useGetPlatformLanguagePresenter(setPlatformLanguageViewModel);

    platformLanguagePresenter.present(
        platformLanguageResponse,
        platformLanguageViewModel,
    );

    return {
        platformLanguageViewModel,
        isRefetchingPlatformLanguage,
        refetchPlatformLanguage,
    };
}
interface UsePreCourseAssessmentToggleProps {
    platformLanguageViewModel:
        | viewModels.TPlatformLanguageViewModel
        | undefined;
    refetchPlatformLanguage: () => Promise<any>;
    setError: (error: string | undefined) => void;
}

function usePreCourseAssessmentToggle({
    platformLanguageViewModel,
    refetchPlatformLanguage,
    setError,
}: UsePreCourseAssessmentToggleProps) {
    const togglePreCourseAssessmentMutation =
        trpc.togglePreCourseAssessment.useMutation();

    const onTogglePreCourseAssessment = async (enable: boolean) => {
        if (!platformLanguageViewModel) return;
        if (platformLanguageViewModel.mode !== 'default') return;

        setError(undefined);
        const response = await togglePreCourseAssessmentMutation.mutateAsync({
            enablePreCourseAssessment: enable,
        });

        if (response.success) {
            await refetchPlatformLanguage();
        } else {
            setError('An error occurred while toggling the form.');
        }
    };

    return {
        onTogglePreCourseAssessment,
        isPending: togglePreCourseAssessmentMutation.isPending,
    };
}

interface PreCourseAssessmentDisabledCardProps {
    onEnable: () => void;
    isPending: boolean;
}

function PreCourseAssessmentDisabledCard({
    onEnable,
    isPending,
}: PreCourseAssessmentDisabledCardProps) {
    return (
        <div className="flex flex-col justify-between w-full bg-neutral-800 h-28 rounded-md border-1 border-neutral-700 p-4">
            <span className="text-sm text-text-primary font-bold">
                This form is disabled.
            </span>
            <Button
                variant="primary"
                text={isPending ? 'Enabling form...' : 'Enable form'}
                className="w-min"
                size="small"
                onClick={onEnable}
                disabled={isPending}
            />
        </div>
    );
}

interface PreCourseAssessmentEnabledControlsProps {
    onDisable: () => void;
    isPending: boolean;
}

function PreCourseAssessmentEnabledControls({
    onDisable,
    isPending,
}: PreCourseAssessmentEnabledControlsProps) {
    return (
        <Button
            variant="text"
            className="text-sm p-0 m-0"
            text={isPending ? 'Disabling...' : 'Disable'}
            onClick={onDisable}
            disabled={isPending}
        />
    );
}

function PreCourseAssessmentFormBuilder() {
    // TODO: fetch components
    const editLessonsTranslations = useTranslations('pages.editLesson');

    const [components, setComponents] = useState<LessonElement[]>([]);

    const componentButtons: LessonComponentButton[] = [
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
                    },
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
    ];

    const [validationErrors, elementValidationErrors] = useState<
        Map<string, string | undefined>
    >(new Map());

    // Currently dummy IDs and version since pre-course assessment is not tied to a course.
    // If components that require uploads are included in the pre-course assessment,
    // corresponding upload handlers need to be implemented.
    return (
        <div className="flex flex-col lg:flex-row gap-4">
            <div className="text-text-primary flex flex-col gap-2 lg:w-[260px] w-full">
                <SubsectionHeading text="Components" />
                {componentButtons.map((button, index) => (
                    <ComponentCard
                        key={index}
                        name={button.label}
                        icon={button.icon}
                        onClick={button.onClick}
                    />
                ))}
            </div>
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <EditLessonComponents
                    lessonId={-1} // Dummy ID for pre-course assessment
                    components={components}
                    setComponents={setComponents}
                    courseVersion={-1} // Dummy version for pre-course assessment
                    setCourseVersion={() => {
                        // No-op for pre-course assessment
                    }}
                    validationErrors={validationErrors}
                />
            </div>
        </div>
    );
}

interface PreCourseAssessmentContentProps {
    platformLanguageViewModel:
        | viewModels.TPlatformLanguageViewModel
        | undefined;
    onToggle: (enable: boolean) => void;
    isTogglePending: boolean;
    isPlatformRefetching: boolean;
    error: string | undefined;
}

export function PreCourseAssessmentContent({
    platformLanguageViewModel,
    onToggle,
    isTogglePending,
    isPlatformRefetching,
    error,
}: PreCourseAssessmentContentProps) {
    const locale = useLocale() as TLocale;

    if (!platformLanguageViewModel || isPlatformRefetching) {
        return <DefaultLoading locale={locale} />;
    }

    if (platformLanguageViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const isEnabled = platformLanguageViewModel.data.enablePreCourseAssessment;

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-4 border-1 border-card-stroke">
            <div className="w-full flex sm:flex-row gap-2 flex-col sm:gap-0 justify-between items-start sm:items-center">
                <SectionHeading text="Pre-course assessment form" />
                {isEnabled && (
                    <PreCourseAssessmentEnabledControls
                        onDisable={() => onToggle(false)}
                        isPending={isTogglePending}
                    />
                )}
            </div>
            <span className="text-sm text-text-secondary">
                This form is displayed automatically at the beginning of each
                course
            </span>
            {error && <DefaultError locale={locale} description={error} />}

            {!isEnabled && (
                <PreCourseAssessmentDisabledCard
                    onEnable={() => onToggle(true)}
                    isPending={isTogglePending}
                />
            )}

            {isEnabled && <PreCourseAssessmentFormBuilder />}
        </div>
    );
}

export default function EditPreCourseAssessment() {
    const [error, setError] = useState<string | undefined>(undefined);

    const {
        platformLanguageViewModel,
        isRefetchingPlatformLanguage,
        refetchPlatformLanguage,
    } = usePlatformLanguage();

    const { onTogglePreCourseAssessment, isPending } =
        usePreCourseAssessmentToggle({
            platformLanguageViewModel,
            refetchPlatformLanguage,
            setError,
        });

    // Success state
    return (
        <PreCourseAssessmentContent
            platformLanguageViewModel={platformLanguageViewModel}
            onToggle={onTogglePreCourseAssessment}
            isTogglePending={isPending}
            isPlatformRefetching={isRefetchingPlatformLanguage}
            error={error}
        />
    );
}
