import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../../trpc/cms-client';
import { useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    AssessmentSubmissionRenderer,
    FormElement,
    EmptyState,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListAssessmentProgressesPresenter } from '../../../hooks/use-assessment-progresses-presenter';

interface EnrolledCourseCompletedAssessmentProps {
    courseSlug: string;
    studentUsername?: string; // Optional: if provided, coach is viewing this student's PCA
}

export default function EnrolledCourseCompletedAssessment(
    props: EnrolledCourseCompletedAssessmentProps,
) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.enrolledCourse');

    // Determine if this is a coach viewing a student's PCA
    const isCoachView = !!props.studentUsername;

    const [progressResponse] = trpc.listAssessmentProgresses.useSuspenseQuery({
        courseSlug: props.courseSlug,
        requestDetails: isCoachView
            ? {
                requestType: 'other',
                studentUsername: props.studentUsername!,
            }
            : {
                requestType: 'self',
            },
    });

    const [progressViewModel, setProgressViewModel] = useState<
        viewModels.TAssessmentProgressListViewModel | undefined
    >(undefined);
    const { presenter: progressPresenter } =
        useListAssessmentProgressesPresenter(setProgressViewModel);

    // @ts-ignore
    progressPresenter.present(progressResponse, progressViewModel);

    const formElements: FormElement[] = useMemo(() => {
        if (!progressViewModel || progressViewModel.mode !== 'default') {
            return [];
        }

        try {
            const components = progressViewModel.data.components;
            return transformLessonComponents(components) as FormElement[];
        } catch (error) {
            console.error('Error transforming lesson components:', error);
            return [];
        }
    }, [progressViewModel]);

    if (!progressViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (progressViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    // @ts-ignore - Handle not-found mode if it exists
    if (progressViewModel.mode === 'not-found') {
        return (
            <EmptyState
                locale={locale}
                message="This course does not have a pre-course assessment."
            />
        );
    }

    // Check if we have data before accessing components
    if (progressViewModel.mode === 'default' && progressViewModel.data.components.length === 0) {
        return (
            <EmptyState
                locale={locale}
                message="No submitted pre course assessment found for this course."
            />
        );
    }

    // If formElements is empty due to transformation error, show error
    if (progressViewModel.mode === 'default' && formElements.length === 0 && progressViewModel.data.components.length > 0) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.assessmentComponentsLoadFailed')}
            />
        );
    }

    return <AssessmentSubmissionRenderer elements={formElements} locale={locale} />;
}
