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
    FormElementType,
    HeadingElement,
    OneOutOfThreeElement,
    RichTextElement,
    SingleChoiceElement,
    TextInputElement,
    multiCheckElement,
} from '@maany_shr/e-class-ui-kit';

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

        const elements: FormElement[] = [];
        for (const component of components) {
            let element: FormElement | undefined;
            if (component.type === 'richText') {
                const typedElement: RichTextElement = {
                    type: FormElementType.RichText,
                    order: component.order,
                    id: component.id,
                    content: component.text,
                };
                element = typedElement;
            }
            if (component.type === 'heading') {
                const typedElement: HeadingElement = {
                    type: FormElementType.HeadingText,
                    order: component.order,
                    id: component.id,
                    heading: component.text,
                    headingType: component.size,
                };
                element = typedElement;
            }
            if (component.type === 'singleChoice') {
                const typedElement: SingleChoiceElement = {
                    type: FormElementType.SingleChoice,
                    order: component.order,
                    id: component.id,
                    title: component.title,
                    options: component.options.map((option) => ({
                        name: option.name,
                        isSelected: false,
                    })),
                };
                element = typedElement;
            }
            if (component.type === 'multipleChoice') {
                const typedElement: multiCheckElement = {
                    type: FormElementType.MultiCheck,
                    order: component.order,
                    id: component.id,
                    title: component.title,
                    options: component.options.map((option) => ({
                        name: option.name,
                        isSelected: false,
                    })),
                };
                element = typedElement;
            }
            if (component.type === 'textInput') {
                const typedElement: TextInputElement = {
                    type: FormElementType.TextInput,
                    order: component.order,
                    id: component.id,
                    helperText: component.helperText,
                };
                element = typedElement;
            }
            if (component.type === 'oneOutOfThree') {
                const typedElement: OneOutOfThreeElement = {
                    type: FormElementType.OneOutOfThree,
                    order: component.order,
                    id: component.id,
                    data: {
                        tableTitle: component.title,
                        rows: [],
                    },
                };
                element = typedElement;
            }
            if (!element) {
                console.error(`Unknown component type: ${component.type}`);
                continue;
            }
            elements.push(element);
        }
        return elements;
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
                onSubmit={() => {}}
                elements={formElements}
                locale={locale}
            />
        </div>
    );
}
