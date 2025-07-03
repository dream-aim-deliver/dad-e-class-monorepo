'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../trpc/client';
import { useMemo, useState } from 'react';
import { useListAssessmentComponentsPresenter } from '../../hooks/use-assessment-components-presenter';
import { viewModels } from '@maany_shr/e-class-models';
import {
    DefaultError,
    DefaultLoading,
    FormElement,
    FormElementRenderer,
} from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../utils/transform-lesson-components';

interface AssessmentFormProps {
    courseSlug: string;
}

export default function AssessmentForm(props: AssessmentFormProps) {
    const locale = useLocale() as TLocale;

    const [componentsResponse] = trpc.listAssessmentComponents.useSuspenseQuery(
        {
            courseSlug: props.courseSlug,
        },
    );
    const [componentsViewModel, setComponentsViewModel] = useState<
        viewModels.TAssessmentComponentListViewModel | undefined
    >(undefined);
    const { presenter } = useListAssessmentComponentsPresenter(
        setComponentsViewModel,
    );
    presenter.present(componentsResponse, componentsViewModel);

    const formElements: FormElement[] = useMemo(() => {
        if (!componentsViewModel || componentsViewModel.mode !== 'default') {
            return [];
        }
        const components = componentsViewModel.data.components;

        return transformLessonComponents(components);
    }, [componentsViewModel]);

    if (!componentsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (componentsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex justify-center">
            <FormElementRenderer
                isError={false}
                isLoading={false}
                onSubmit={() => {
                    console.log('Form submitted');
                }}
                elements={formElements}
                locale={locale}
            />
        </div>
    );
}
