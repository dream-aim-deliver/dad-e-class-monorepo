import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../../trpc/client';
import { useListAssessmentComponentsPresenter } from '../../../hooks/use-assessment-components-presenter';
import { useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    FormElement,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListAssessmentProgressesPresenter } from '../../../hooks/use-assessment-progresses-presenter';
import { SubmissionElementsRenderer } from 'packages/ui-kit/lib/components/pre-assessment/submission-renderer';

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

        const elements = transformLessonComponents(components);

        const answers = progressViewModel.data.progress;

        for (const element of elements) {
            const answer = answers.find((a) => a.componentId === element.id);
            if (answer) {
                switch (element.type) {
                    case 'textInput':
                        if (answer.type === 'textInput') {
                            element.content = answer.answer;
                        }
                        break;
                    case 'singleChoice':
                        if (answer.type === 'singleChoice') {
                            element.options.forEach((option) => {
                                option.isSelected =
                                    answer.answerId === option.id;
                            });
                        }
                        break;
                    case 'multiCheck':
                        if (answer.type === 'multipleChoice') {
                            element.options.forEach((option) => {
                                if (option.id === undefined) return;
                                option.isSelected = answer.answerIds.includes(
                                    option.id,
                                );
                            });
                        }
                        break;
                    case 'oneOutOfThree':
                        if (answer.type === 'oneOutOfThree') {
                            for (const row of element.data.rows) {
                                for (const column of row.columns) {
                                    column.selected = answer.answers.some(
                                        (a) =>
                                            a.rowId === row.id &&
                                            a.columnId === column.id,
                                    );
                                }
                            }
                        }
                        break;
                    default:
                        // Handle other types if necessary
                        break;
                }
            }
        }

        return elements;
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

    return (
        <SubmissionElementsRenderer elements={formElements} locale={locale} />
    );
}
