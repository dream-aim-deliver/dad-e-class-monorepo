'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../trpc/cms-client';
import { useEffect, useMemo, useState } from 'react';
import { useListAssessmentComponentsPresenter } from '../../hooks/use-assessment-components-presenter';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import {
    DefaultError,
    DefaultLoading,
    FormElement,
    FormElementRenderer,
    PreAssessmentForm,
    AssessmentSubmissionConfirmationModal,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../utils/transform-lesson-components';
import { transformFormAnswers } from '../../utils/transform-answers';
import { useSubmitAssessmentProgressPresenter } from '../../hooks/use-assessment-progress-presenter';
import { useRouter } from 'next/navigation';
import {
    AssessmentFileUploadProvider,
    useAssessmentFileUploadContext,
} from './utils/assessment-file-upload';

interface AssessmentFormProps {
    courseSlug: string;
}

export default function AssessmentForm(props: AssessmentFormProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.assessmentForm');
    const router = useRouter();
    const utils = trpc.useUtils();

    const [componentsResponse] =
        trpc.listPreCourseAssessmentComponents.useSuspenseQuery({});
    const [componentsViewModel, setComponentsViewModel] = useState<
        viewModels.TAssessmentComponentListViewModel | undefined
    >(undefined);
    const { presenter: assessmentsPresenter } =
        useListAssessmentComponentsPresenter(setComponentsViewModel);

    // @ts-ignore
    assessmentsPresenter.present(componentsResponse, componentsViewModel);

    const [submitAssessmentViewModel, setSubmitAssessmentViewModel] = useState<
        viewModels.TAssessmentProgressViewModel | undefined
    >(undefined);
    const { presenter: submitPresenter } = useSubmitAssessmentProgressPresenter(
        setSubmitAssessmentViewModel,
    );

    const formElements: FormElement[] = useMemo(() => {
        if (!componentsViewModel || componentsViewModel.mode !== 'default') {
            return [];
        }
        const components = componentsViewModel.data.components;

        return transformLessonComponents(components) as FormElement[];
    }, [componentsViewModel]);

    const submitMutation = trpc.submitAssessmentProgress.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.getCourseAccess.invalidate({ courseSlug: props.courseSlug });
            utils.getEnrolledCourseDetails.invalidate({ courseSlug: props.courseSlug });
            utils.listUserCourses.invalidate();

            // Navigate to course page to re-trigger RSC evaluation
            // This will show the enrolled course view since assessment is now complete
            router.push(`/courses/${props.courseSlug}`);
        },
    });

    const getIsFormDisabled = () => {
        return (
            componentsViewModel?.mode === 'default' &&
            componentsViewModel.data.components.length === 0
        );
    };

    useEffect(() => {
        if (getIsFormDisabled()) {
            submitMutation.mutate({
                progress: [],
                courseSlug: props.courseSlug,
            });
        }
    }, [componentsViewModel]);

    useEffect(() => {
        if (submitMutation.isSuccess) {
            // @ts-ignore
            submitPresenter.present(submitMutation.data, submitAssessmentViewModel);
        }
    }, [submitMutation.isSuccess]);


    if (!componentsViewModel || getIsFormDisabled()) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (componentsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const hasViewModelError = Boolean(
        submitAssessmentViewModel &&
        submitAssessmentViewModel.mode !== 'default',
    );

    const getErrorMessage = () => {
        if (submitAssessmentViewModel?.mode === 'invalid') {
            return submitAssessmentViewModel.data.message;
        }
        if (submitMutation.error || hasViewModelError) {
            return t('defaultFormError');
        }
        return undefined;
    };

    return (
        <AssessmentFileUploadProvider config={{ courseSlug: props.courseSlug }}>
            <div className="flex justify-center">
                <PreAssessmentForm locale={locale}>
                    <AssessmentFormContent
                        formElements={formElements}
                        locale={locale}
                        hasViewModelError={hasViewModelError}
                        submitMutation={submitMutation}
                        getErrorMessage={getErrorMessage}
                        courseSlug={props.courseSlug}
                    />
                </PreAssessmentForm>
            </div>
        </AssessmentFileUploadProvider>
    );
}

function AssessmentFormContent({
    formElements,
    locale,
    hasViewModelError,
    submitMutation,
    getErrorMessage,
    courseSlug,
}: {
    formElements: FormElement[];
    locale: TLocale;
    hasViewModelError: boolean;
    submitMutation: ReturnType<typeof trpc.submitAssessmentProgress.useMutation>;
    getErrorMessage: () => string | undefined;
    courseSlug: string;
}) {
    const { uploadFile } = useAssessmentFileUploadContext();
    const t = useTranslations('components.assessmentSubmissionConfirmationModal');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [pendingFormValues, setPendingFormValues] = useState<
        Record<string, any> | null
    >(null);

    // Wrapper function to match the expected signature
    const onFileUpload = async (
        uploadRequest: import('@maany_shr/e-class-models').fileMetadata.TFileUploadRequest,
        componentId: string,
        courseSlug: string,
        abortSignal?: AbortSignal,
    ): Promise<import('@maany_shr/e-class-models').fileMetadata.TFileMetadata | null> => {
        try {
            const result = await uploadFile(uploadRequest, componentId, abortSignal);
            return result;
        } catch (error) {
            console.error('Assessment file upload error:', error);
            return null;
        }
    };

    const handleSubmit = (formValues: Record<string, any>) => {
        // Store form values and show confirmation modal
        setPendingFormValues(formValues);
        setShowConfirmationModal(true);
    };

    const handleConfirmSubmit = () => {
        if (pendingFormValues) {
            const progress: useCaseModels.TPreCourseAssessmentProgress[] =
                transformFormAnswers(pendingFormValues);
            submitMutation.mutate({
                progress,
                courseSlug: courseSlug,
            });
            setShowConfirmationModal(false);
            setPendingFormValues(null);
        }
    };

    const handleCancelSubmit = () => {
        setShowConfirmationModal(false);
        setPendingFormValues(null);
    };

    return (
        <>
            <FormElementRenderer
                isError={hasViewModelError || submitMutation.isError}
                isLoading={submitMutation.isPending}
                onSubmit={handleSubmit}
                elements={formElements}
                locale={locale}
                errorMessage={getErrorMessage()}
                onFileUpload={onFileUpload}
                courseSlug={courseSlug}
            />
            {showConfirmationModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <AssessmentSubmissionConfirmationModal
                        locale={locale}
                        title={t('title')}
                        message={t('message')}
                        onClose={handleCancelSubmit}
                        onSubmit={handleConfirmSubmit}
                    />
                </div>
            )}
        </>
    );
}
