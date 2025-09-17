'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../trpc/client';
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

interface AssessmentFormProps {
    courseSlug: string;
}

export default function AssessmentForm(props: AssessmentFormProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.assessmentForm');

    const [componentsResponse] = trpc.listPreCourseAssessmentComponents.useSuspenseQuery(
        {
            courseSlug: props.courseSlug,
        },
    );
    const [componentsViewModel, setComponentsViewModel] = useState<
        viewModels.TAssessmentComponentListViewModel | undefined
    >(undefined);
    const { presenter: assessmentsPresenter } =
        useListAssessmentComponentsPresenter(setComponentsViewModel);
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

    const submitMutation = trpc.submitAssessmentProgress.useMutation({});

    useEffect(() => {
        if (submitMutation.isSuccess) {
            submitPresenter.present(
                submitMutation.data,
                submitAssessmentViewModel,
            );
        }
    }, [submitMutation.isSuccess]);

    useEffect(() => {
        if (submitAssessmentViewModel?.mode === 'default') {
            window.location.reload();
        }
    }, [submitAssessmentViewModel]);

    if (!componentsViewModel) {
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
                        const answers: useCaseModels.TAnswer[] =
                            transformFormAnswers(formValues);
                        submitMutation.mutate({
                            answers,
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
