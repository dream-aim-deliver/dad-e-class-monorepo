import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { Button, FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { useMemo, useRef } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    ComponentRendererProps,
    typeToRendererMap,
} from '../../common/component-renderers';
import { trpc } from '../../../trpc/client';

interface LessonFormProps {
    lessonId: number;
    data: viewModels.TLessonComponentListSuccess;
    enableSubmit?: boolean;
}

export default function LessonForm({
    lessonId,
    data,
    enableSubmit = false,
}: LessonFormProps) {
    const components = data.components;
    const locale = useLocale() as TLocale;

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    const elementProgress = useRef(new Map([...formElements]));
    const submitProgressMutation = trpc.submitLessonProgresses.useMutation();
    // When implementing student submission, this will be used to track progress

    const renderComponent = (component: useCaseModels.TLessonComponent) => {
        const formElement = formElements.get(component.id) as
            | FormElement
            | undefined;
        if (!formElement) return null;

        const props: ComponentRendererProps = {
            formElement,
            elementProgress,
            locale,
            key: `component-${component.id}`,
        };

        const renderer = typeToRendererMap[formElement.type];
        if (renderer) {
            return renderer(props);
        }
    };

    const submitProgress = async () => {
        const progress: useCaseModels.TLessonProgress[] = [];
        for (const [_, element] of elementProgress.current) {
            if (element.type === 'textInput') {
                if (!element.content || element.content.trim() === '') {
                    if (element.required) {
                        throw new Error('Please fill in all required text inputs before submitting.');
                    }
                    return;
                }
                progress.push({
                    componentId: element.id,
                    type: 'textInput',
                    answer: element.content,
                });
            }
            if (element.type === 'singleChoice') {
                const answerId = element.options.find((opt) => opt.isSelected)?.id;

                if (!answerId) {
                    if (element.required) {
                        throw new Error('Please select an option for all required single choice questions before submitting.');
                    }
                    return;
                }
                progress.push({
                    componentId: element.id,
                    type: 'singleChoice',
                    answerId: answerId,
                });
            }
            if (element.type === 'multiCheck') {
                const selectedOptionIds = element.options
                    .filter((opt) => opt.isSelected && opt.id !== undefined)
                    .map((opt) => opt.id!);

                if (selectedOptionIds.length === 0) {
                    if (element.required) {
                        throw new Error('Please select at least one option for all required multiple choice questions before submitting.');
                    }
                    return;
                }
                progress.push({
                    componentId: element.id,
                    type: 'multipleChoice',
                    answerIds: selectedOptionIds,
                });
            }
            if (element.type === 'oneOutOfThree') {
                const answers: { rowId: string; columnId: string }[] = [];
                for (const row of element.data.rows) {
                    if (row.id === undefined) continue;
                    const selectedOption = row.columns.find((col) => col.selected);
                    if (selectedOption?.id === undefined) continue;
                    if (selectedOption) {
                        answers.push({ rowId: row.id, columnId: selectedOption.id });
                    }
                }
                if (answers.length !== 3) {
                    if (element.required) {
                        throw new Error('Please select one option from each row for all required questions before submitting.');
                    }
                    return;
                }
                progress.push({
                    componentId: element.id,
                    type: 'oneOutOfThree',
                    answers: answers,
                });
            }
        }

        submitProgressMutation.mutateAsync({
            lessonId: lessonId,
            progress: progress,
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {components.map(renderComponent)}
            <Button variant="primary" text="Submit" onClick={submitProgress} />
        </div>
    );
}
