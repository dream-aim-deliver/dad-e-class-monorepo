'use client';

import {
    Breadcrumbs,
    Button,
    DefaultError,
    DefaultLoading,
    IconSave,
    LessonElement,
    PreCourseAssessmentBuilder,
    PreCourseAssessmentPreviewer,
    SectionHeading,
    Tabs,
    validatorPerType,
    Banner,
    FeedBackMessage,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../trpc/cms-client';
import { Suspense, useEffect, useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../hooks/use-platform-language-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { useGenerateTempId } from './common/hooks/use-generate-temp-id';
import { useListAssessmentComponentsPresenter } from '../hooks/use-assessment-components-presenter';
import { transformLessonComponents } from '../utils/transform-lesson-components';
import { useLessonToRequest } from './common/hooks/use-lesson-to-request';
import { useRouter } from 'next/navigation';
import { useRequiredPlatform } from '../context/platform-context';
import { useContentLocale } from '../hooks/use-platform-translations';

interface UsePreCourseAssessmentToggleProps {
    platformLanguageViewModel:
        | viewModels.TPlatformLanguageViewModel
        | undefined;
    refetchPlatformLanguage: () => Promise<any>;
    setError: (error: string | undefined) => void;
    toggleError: string;
}

function usePreCourseAssessmentToggle({
    platformLanguageViewModel,
    refetchPlatformLanguage,
    setError,
    toggleError,
}: UsePreCourseAssessmentToggleProps) {
    const togglePreCourseAssessmentMutation =
        trpc.togglePreCourseAssessment.useMutation({
            onSuccess: async (data) => {
                if (data.success) {
                    await refetchPlatformLanguage();
                } else {
                    setError(toggleError);
                }
            },
            onError: () => {
                setError(toggleError);
            }
        });

    const onTogglePreCourseAssessment = (enable: boolean) => {
        if (!platformLanguageViewModel) return;
        if (platformLanguageViewModel.mode !== 'default') return;

        setError(undefined);
        togglePreCourseAssessmentMutation.mutate({
            enablePreCourseAssessment: enable,
        });
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
    const t = useTranslations('pages.preCourseAssessmentForm');

    return (
        <div className="flex flex-col justify-between w-full bg-neutral-800 h-28 rounded-md border-1 border-neutral-700 p-4">
            <span className="text-sm text-text-primary font-bold">
                {t('disabled')}
            </span>
            <Button
                variant="primary"
                text={isPending ? t('enabling') : t('enableForm')}
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
    const t = useTranslations('pages.preCourseAssessmentForm');

    return (
        <div className="flex flex-row gap-4">
            <Button
                variant="primary"
                hasIconLeft
                iconLeft={<IconSave />}
                text={isSaving ? t('saving') : t('save')}
                onClick={onSave}
                disabled={isSaving || isPending}
            />
            <Button
                variant="text"
                className="text-sm p-0 m-0"
                text={isPending ? t('disabling') : t('disable')}
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
    const locale = useLocale() as TLocale;
    const editLessonsTranslations = useTranslations('pages.editLesson');
    const { generateTempId } = useGenerateTempId();

    return (
        <PreCourseAssessmentBuilder
            components={components}
            setComponents={setComponents}
            validationErrors={validationErrors}
            locale={locale}
            generateTempId={generateTempId}
            translations={{
                richText: editLessonsTranslations('richText'),
                heading: editLessonsTranslations('heading'),
                textInput: editLessonsTranslations('textInput'),
                singleChoice: editLessonsTranslations('singleChoice'),
                checklist: editLessonsTranslations('checklist'),
                oneOutOfThree: editLessonsTranslations('oneOutOfThree'),
                uploadFiles: editLessonsTranslations('uploadFiles'),
                components: 'Components',
            }}
        />
    );
}

function PreviewRenderer({
    components,
}: {
    components: LessonElement[];
}) {
    const locale = useLocale() as TLocale;

    // Mock file upload handler for preview mode
    const mockFileUpload = async (
        uploadRequest: any,
        componentId: string,
        courseSlug: string,
        abortSignal?: AbortSignal,
    ) => {
        // Return a mock file metadata object for preview
        return {
            id: `mock-${Date.now()}`,
            name: uploadRequest.name,
            size: uploadRequest.file.size,
            category: 'generic' as const,
            url: URL.createObjectURL(uploadRequest.file),
            thumbnailUrl: URL.createObjectURL(uploadRequest.file),
            status: 'available' as const,
        };
    };

    return (
        <PreCourseAssessmentPreviewer
            components={components}
            locale={locale}
            onFileUpload={mockFileUpload}
            courseSlug="preview"
        />
    );
}

function PreCourseAssessmentTabs({
    components,
    setComponents,
    validationErrors,
}: PreCourseAssessmentTabProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.preCourseAssessmentForm');

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
                    {t('formBuilderTab')}
                </Tabs.Trigger>
                <Tabs.Trigger value="preview" isLast={true}>
                    {t('previewTab')}
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
                <PreviewRenderer components={components} />
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
    const router = useRouter();
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const t = useTranslations('pages.preCourseAssessmentForm');
    
    // Platform context
    const { platform } = useRequiredPlatform();
    const contentLocale = useContentLocale();

    const [components, setComponents] = useState<LessonElement[]>([]);

    const [validationErrors, setElementValidationErrors] = useState<
        Map<string, string | undefined>
    >(new Map());

    const utils = trpc.useUtils();
    const savePreCourseAssessmentComponents =
        trpc.savePreCourseAssessmentComponents.useMutation({
            onSuccess: async (data) => {
                if (data.success) {
                    setSaveSuccessMessage(t('saveSuccess'));
                    // Invalidate and refetch the components list
                    await utils.listPreCourseAssessmentComponents.invalidate();
                } else {
                    setSaveError(t('saveError'));
                }
            },
            onError: (error) => {
                setSaveError(error?.message || t('saveError'));
            }
        });
    const [saveError, setSaveError] = useState<string | undefined>(undefined);
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
    const { transformLessonToRequest } = useLessonToRequest();

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
                    // All LessonElements have an id property
                    const componentId = (component as { id: string }).id;
                    newErrors.set(componentId, error);
                }
            }
        });
        setElementValidationErrors(newErrors);
        return newErrors.size === 0;
    };

    const onSaveComponents = () => {
        if (!validateComponents()) {
            return;
        }
        // Clear previous messages
        setSaveError(undefined);
        setSaveSuccessMessage(null);

        const transformedComponents = transformLessonToRequest(components);
        savePreCourseAssessmentComponents.mutate({
            components:
                transformedComponents as useCaseModels.TAssessmentComponentRequest[],
        });
    };

    // Auto-dismiss success message after 5 seconds
    useEffect(() => {
        if (saveSuccessMessage) {
            const timer = setTimeout(() => setSaveSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccessMessage]);

    if (!platformLanguageViewModel || isPlatformRefetching) {
        return <DefaultLoading locale={locale} />;
    }

    if (platformLanguageViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const isEnabled = platformLanguageViewModel.data.enablePreCourseAssessment;

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => router.push('/'),
                    },
                    {
                        label: breadcrumbsTranslations('preCourseAssessmentForm'),
                        onClick: () => {
                            // Nothing should happen on clicking the current page
                        },
                    },
                ]}
            />
            <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-4 border-1 border-card-stroke">
                <div className="w-full flex sm:flex-row gap-2 flex-col sm:gap-0 justify-between items-start sm:items-center">
                    <div className="flex flex-col space-y-2">
                        <h1> {t('title')} </h1>
                        <p className="text-text-secondary text-sm">
                            Platform: {platform.name} | Content Language: {contentLocale.toUpperCase()}
                        </p>
                    </div>
                {isEnabled && (
                    <PreCourseAssessmentEnabledControls
                        onDisable={() => onToggle(false)}
                        isPending={isTogglePending}
                        onSave={onSaveComponents}
                        isSaving={savePreCourseAssessmentComponents.isPending}
                    />
                )}
            </div>
            <span className="text-sm text-text-secondary">
                {t('description')}
            </span>

            {/* Success Banner */}
            {saveSuccessMessage && (
                <Banner
                    title="Success!"
                    description={saveSuccessMessage}
                    style="success"
                    closeable={true}
                    onClose={() => setSaveSuccessMessage(null)}
                />
            )}

            {/* Save Error Message */}
            {saveError && (
                <FeedBackMessage
                    type="error"
                    message={saveError}
                />
            )}

            {/* Toggle Error Message */}
            {toggleError && <DefaultError locale={locale} description={toggleError} />}

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
        </div>
    );
}

export default function PreCourseAssessment() {
    const t = useTranslations('pages.preCourseAssessmentForm');
    const [toggleError, setToggleError] = useState<string | undefined>(
        undefined,
    );

    // Data fetching - query for platform language data
    const [platformLanguageResponse, { refetch: refetchPlatformLanguage, isRefetching: isRefetchingPlatformLanguage }] = trpc.getPlatformLanguage.useSuspenseQuery({});

    const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);

    // Query presenter
    const { presenter: platformLanguagePresenter } = useGetPlatformLanguagePresenter(
        setPlatformLanguageViewModel,
    );

    // Present the data when it changes (moved to useEffect to avoid side effects during render)
    useEffect(() => {
        // @ts-ignore - Presenter doesn't handle progress states
        platformLanguagePresenter.present(platformLanguageResponse, platformLanguageViewModel);
    }, [platformLanguageResponse, platformLanguagePresenter]);

    const { onTogglePreCourseAssessment, isPending } =
        usePreCourseAssessmentToggle({
            platformLanguageViewModel,
            refetchPlatformLanguage,
            setError: setToggleError,
            toggleError: t('toggleError'),
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

