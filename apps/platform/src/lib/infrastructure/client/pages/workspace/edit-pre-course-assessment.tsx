'use client';

import {
    Button,
    ComponentCard,
    DefaultError,
    DefaultLoading,
    FormElementType,
    HeadingElement,
    IconHeading,
    IconMultiChoice,
    IconOneOutOfThree,
    IconRichText,
    IconSave,
    IconSingleChoice,
    IconTextInput,
    LessonElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SectionHeading,
    SingleChoiceElement,
    SubsectionHeading,
    Tabs,
    TextInputElement,
    validatorPerType,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../../hooks/use-platform-language-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { LessonComponentButton } from './edit/types';
import { generateTempId } from './edit/utils/generate-temp-id';
import { useListAssessmentComponentsPresenter } from '../../hooks/use-assessment-components-presenter';
import { transformLessonComponents } from '../../utils/transform-lesson-components';
import { transformLessonToRequest } from './edit/utils/lesson-to-request';
import dynamic from 'next/dynamic';
import {
    ComponentRendererProps,
    typeToRendererMap,
} from '../common/component-renderers';

const LoadingComponent = () => {
    const locale = useLocale() as TLocale;
    return <DefaultLoading locale={locale} variant="minimal" />;
};

const EditLessonComponents = dynamic(
    () => import('./edit/edit-lesson-components'),
    {
        loading: LoadingComponent,
        ssr: false,
    },
);

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
        // @ts-ignore
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
    onSave: () => void;
    isPending: boolean;
    isSaving: boolean;
}

function PreCourseAssessmentEnabledControls({
    onDisable,
    onSave,
    isPending,
    isSaving,
}: PreCourseAssessmentEnabledControlsProps) {
    return (
        <div className="flex flex-row gap-4">
            <Button
                variant="primary"
                hasIconLeft
                iconLeft={<IconSave />}
                text={isSaving ? 'Saving...' : 'Save'}
                onClick={onSave}
                disabled={isSaving || isPending}
            />
            <Button
                variant="text"
                className="text-sm p-0 m-0"
                text={isPending ? 'Disabling...' : 'Disable'}
                onClick={onDisable}
                disabled={isPending || isSaving}
            />
        </div>
    );
}

interface PreCourseAssessmentTabProps {
    components: LessonElement[];
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    validationErrors: Map<string, string | undefined>;
}

function PreCourseAssessmentFormBuilder({
    components,
    setComponents,
    validationErrors,
}: PreCourseAssessmentTabProps) {
    // TODO: fetch components
    const editLessonsTranslations = useTranslations('pages.editLesson');

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

function PreviewRenderer({
    components,
    elementProgress,
}: {
    components: LessonElement[];
    elementProgress: React.RefObject<Map<string, LessonElement>>;
}) {
    const locale = useLocale() as TLocale;

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

function PreCourseAssessmentTabs({
    components,
    setComponents,
    validationErrors,
}: PreCourseAssessmentTabProps) {
    const locale = useLocale() as TLocale;

    const [componentsResponse] =
        trpc.listPreCourseAssessmentComponents.useSuspenseQuery(
            {},
            {
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchOnMount: true,
                retry: false,
            },
        );
    const [componentsViewModel, setComponentsViewModel] = useState<
        viewModels.TAssessmentComponentListViewModel | undefined
    >(undefined);
    const { presenter } = useListAssessmentComponentsPresenter(
        setComponentsViewModel,
    );
    // @ts-ignore
    presenter.present(componentsResponse, componentsViewModel);

    useEffect(() => {
        if (!componentsViewModel || componentsViewModel.mode !== 'default')
            return;
        const responseComponents = componentsViewModel.data.components;
        setComponents(transformLessonComponents(responseComponents));
    }, [componentsViewModel]);

    const elementProgress = useRef(new Map<string, LessonElement>());

    if (!componentsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (componentsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <Tabs.Root defaultTab="form">
            <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2 mb-4">
                <Tabs.Trigger value="form" isLast={false}>
                    Form Builder
                </Tabs.Trigger>
                <Tabs.Trigger value="preview" isLast={true}>
                    Preview
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="form">
                <PreCourseAssessmentFormBuilder
                    components={components}
                    setComponents={setComponents}
                    validationErrors={validationErrors}
                />
            </Tabs.Content>

            <Tabs.Content value="preview">
                <PreviewRenderer
                    components={components}
                    elementProgress={elementProgress}
                />
            </Tabs.Content>
        </Tabs.Root>
    );
}

interface PreCourseAssessmentContentProps {
    platformLanguageViewModel:
        | viewModels.TPlatformLanguageViewModel
        | undefined;
    onToggle: (enable: boolean) => void;
    isTogglePending: boolean;
    isPlatformRefetching: boolean;
    toggleError: string | undefined;
}

function PreCourseAssessmentContent({
    platformLanguageViewModel,
    onToggle,
    isTogglePending,
    isPlatformRefetching,
    toggleError,
}: PreCourseAssessmentContentProps) {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);

    const [components, setComponents] = useState<LessonElement[]>([]);

    const [validationErrors, setElementValidationErrors] = useState<
        Map<string, string | undefined>
    >(new Map());

    const saveComponentsMutation =
        trpc.savePreCourseAssessmentComponents.useMutation();
    const [saveError, setSaveError] = useState<string | undefined>(undefined);

    const validateComponents = () => {
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
        setElementValidationErrors(newErrors);
        return newErrors.size === 0;
    };

    const onSaveComponents = async () => {
        if (!validateComponents()) {
            return;
        }
        const transformedComponents = transformLessonToRequest(components);
        const response = await saveComponentsMutation.mutateAsync({
            components:
                transformedComponents as useCaseModels.TAssessmentComponentRequest[],
        });
        if (response.success === true) {
            // @ts-ignore
            setComponents(transformLessonComponents(response.data.components));
        } else {
            setSaveError('Failed to save components. Please try again.');
        }
    };

    if (!platformLanguageViewModel || isPlatformRefetching) {
        return <DefaultLoading locale={locale} />;
    }

    if (platformLanguageViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const isEnabled = platformLanguageViewModel.data.enablePreCourseAssessment;
    const error = toggleError ?? saveError;

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-4 border-1 border-card-stroke">
            <div className="w-full flex sm:flex-row gap-2 flex-col sm:gap-0 justify-between items-start sm:items-center">
                <SectionHeading text="Pre-course assessment form" />
                {isEnabled && (
                    <PreCourseAssessmentEnabledControls
                        onDisable={() => onToggle(false)}
                        isPending={isTogglePending}
                        onSave={onSaveComponents}
                        isSaving={saveComponentsMutation.isPending}
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

            {isEnabled && (
                <Suspense fallback={<DefaultLoading locale={locale} />}>
                    <PreCourseAssessmentTabs
                        components={components}
                        setComponents={setComponents}
                        validationErrors={validationErrors}
                    />
                </Suspense>
            )}
        </div>
    );
}

export default function EditPreCourseAssessment() {
    const [toggleError, setToggleError] = useState<string | undefined>(
        undefined,
    );

    const {
        platformLanguageViewModel,
        isRefetchingPlatformLanguage,
        refetchPlatformLanguage,
    } = usePlatformLanguage();

    const { onTogglePreCourseAssessment, isPending } =
        usePreCourseAssessmentToggle({
            platformLanguageViewModel,
            refetchPlatformLanguage,
            setError: setToggleError,
        });

    // Success state
    return (
        <PreCourseAssessmentContent
            platformLanguageViewModel={platformLanguageViewModel}
            onToggle={onTogglePreCourseAssessment}
            isTogglePending={isPending}
            isPlatformRefetching={isRefetchingPlatformLanguage}
            toggleError={toggleError}
        />
    );
}
