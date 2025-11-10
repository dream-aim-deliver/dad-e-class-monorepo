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
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../utils/transform-lesson-components';
import { transformFormAnswers } from '../../utils/transform-answers';
import { useSubmitAssessmentProgressPresenter } from '../../hooks/use-assessment-progress-presenter';
import { useRouter } from 'next/navigation';

interface AssessmentFormProps {
    courseSlug: string;
}

export default function AssessmentForm(props: AssessmentFormProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.assessmentForm');
    const router = useRouter();
    const utils = trpc.useUtils();

    const [componentsResponse] =
        trpc.listPreCourseAssessmentComponents.useSuspenseQuery({
            courseSlug: props.courseSlug,
        });
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

    // ✅ Removed window.location.reload() - query invalidation + router.push handles UI update

    if (!componentsViewModel || getIsFormDisabled()) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (componentsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const hasViewModelError =
        submitAssessmentViewModel &&
        submitAssessmentViewModel.mode !== 'default';

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
        <div className="flex justify-center">
            <PreAssessmentForm locale={locale}>
                <FormElementRenderer
                    isError={hasViewModelError || submitMutation.isError}
                    isLoading={submitMutation.isPending}
                    onSubmit={(formValues) => {
                        const progress: useCaseModels.TPreCourseAssessmentProgress[] =
                            transformFormAnswers(formValues);
                        submitMutation.mutate({
                            progress,
                            courseSlug: props.courseSlug,
                        });
                    }}
                    elements={formElements}
                    locale={locale}
                    errorMessage={getErrorMessage()}
                />
            </PreAssessmentForm>
        </div>
    );
}
