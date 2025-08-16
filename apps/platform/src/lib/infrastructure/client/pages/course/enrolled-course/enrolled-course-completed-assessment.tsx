import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../../trpc/client';
import { useListAssessmentComponentsPresenter } from '../../../hooks/use-assessment-components-presenter';
import { useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    SubmissionRenderer,
    FormElement,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponentsWithProgress } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListAssessmentProgressesPresenter } from '../../../hooks/use-assessment-progresses-presenter';

interface EnrolledCourseCompletedAssessmentProps {
    courseSlug: string;
}

export default function EnrolledCourseCompletedAssessment(
    props: EnrolledCourseCompletedAssessmentProps,
) {
    const locale = useLocale() as TLocale;

    const [componentsResponse] = trpc.listAssessmentComponents.useSuspenseQuery(
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

    const [progressResponse] = trpc.listAssessmentProgresses.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [progressViewModel, setProgressViewModel] = useState<
        viewModels.TAssessmentProgressListViewModel | undefined
    >(undefined);
    const { presenter: progressPresenter } =
        useListAssessmentProgressesPresenter(setProgressViewModel);
    progressPresenter.present(progressResponse, progressViewModel);

    const formElements: FormElement[] = useMemo(() => {
        if (!componentsViewModel || componentsViewModel.mode !== 'default') {
            return [];
        }
        if (!progressViewModel || progressViewModel.mode !== 'default') {
            return [];
        }

        const components = componentsViewModel.data.components;
        const progress = progressViewModel.data.progress;

        return transformLessonComponentsWithProgress(
            components,
            progress,
        ) as FormElement[];
    }, [componentsViewModel, progressViewModel]);

    if (!componentsViewModel || !progressViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (
        componentsViewModel.mode === 'kaboom' ||
        progressViewModel.mode === 'kaboom'
    ) {
        return <DefaultError locale={locale} />;
    }

    return <SubmissionRenderer elements={formElements} locale={locale} />;
}
