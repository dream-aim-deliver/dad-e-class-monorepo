import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../../trpc/cms-client';
import { useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    AssessmentSubmissionRenderer,
    FormElement,
    DefaultNotFound,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListAssessmentProgressesPresenter } from '../../../hooks/use-assessment-progresses-presenter';
import { useSession } from 'next-auth/react';

interface EnrolledCourseCompletedAssessmentProps {
    courseSlug: string;
}

export default function EnrolledCourseCompletedAssessment(
    props: EnrolledCourseCompletedAssessmentProps,
) {
    const locale = useLocale() as TLocale;
    const { data: session } = useSession();
    
    // Get student ID from session (user.id is the student/user ID)
    const studentId = session?.user?.id;

    const [progressResponse] = trpc.listAssessmentProgresses.useSuspenseQuery({
        courseSlug: props.courseSlug,
        studentId: studentId, // Pass student ID to get the correct student's progress
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

    return <AssessmentSubmissionRenderer elements={formElements} locale={locale} />;
}
