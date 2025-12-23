import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../../trpc/cms-client';
import { useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    SubmissionRenderer,
    FormElement,
    DefaultNotFound,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';
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

    const [progressResponse] = trpc.listAssessmentProgresses.useSuspenseQuery({
        courseSlug: props.courseSlug,
        requestDetails: {
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

        const components = progressViewModel.data.components;

        return transformLessonComponents(components) as FormElement[];
    }, [progressViewModel]);

    if (!progressViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (progressViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (progressViewModel.data.components.length === 0) {
        return (
            <DefaultNotFound
                locale={locale}
                title="Pre course assessment progress not found"
                description="No submitted pre course assessment found for this course."
            />
        );
    }

    return <SubmissionRenderer elements={formElements} locale={locale} />;
}
