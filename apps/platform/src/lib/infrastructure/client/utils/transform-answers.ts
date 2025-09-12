import { useCaseModels } from '@maany_shr/e-class-models';
import {
    FormElement,
    TextInputElement,
    SingleChoiceElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    LessonElement,
} from '@maany_shr/e-class-ui-kit';

function transformTextInputAnswer(
    element: TextInputElement,
): Extract<useCaseModels.TAnswer, { type: 'textInput' }> {
    if (!element.content) {
        throw new Error(`Text input element ${element.id} is missing content`);
    }

    return {
        componentId: element.id,
        type: 'textInput',
        answer: element.content,
    };
}

function transformSingleChoiceAnswer(
    element: SingleChoiceElement,
): Extract<useCaseModels.TAnswer, { type: 'singleChoice' }> {
    const answerId = element.options.find((option) => option.isSelected)?.id;

    if (answerId === undefined) {
        throw new Error(
            `Single choice element ${element.id} has no selected option`,
        );
    }

    return {
        componentId: element.id,
        type: 'singleChoice',
        answerId: answerId,
    };
}

function transformMultiCheckAnswer(
    element: MultiCheckElement,
): Extract<useCaseModels.TAnswer, { type: 'multipleChoice' }> {
    const answerIds: string[] = [];

    for (const option of element.options) {
        if (option.isSelected && option.id) {
            answerIds.push(option.id);
        }
    }

    if (answerIds.length === 0) {
        throw new Error(
            `Multi check element ${element.id} has no selected options`,
        );
    }

    return {
        componentId: element.id,
        type: 'multipleChoice',
        answerIds: answerIds,
    };
}

function transformOneOutOfThreeAnswer(
    element: OneOutOfThreeElement,
): Extract<useCaseModels.TAnswer, { type: 'oneOutOfThree' }> {
    const answers: Array<{ rowId: string; columnId: string }> = [];

    for (const row of element.data.rows) {
        const selectedColumn = row.columns.find((col) => col.selected);

        if (selectedColumn && selectedColumn.id && row.id) {
            answers.push({
                rowId: row.id,
                columnId: selectedColumn.id,
            });
        } else {
            throw new Error(
                `One out of three element ${element.id} has incomplete selection for row ${row.id}`,
            );
        }
    }

    if (answers.length === 0) {
        throw new Error(
            `One out of three element ${element.id} has no answers`,
        );
    }

    return {
        componentId: element.id,
        type: 'oneOutOfThree',
        answers: answers,
    };
}

const answerTransformers = {
    textInput: transformTextInputAnswer,
    singleChoice: transformSingleChoiceAnswer,
    multiCheck: transformMultiCheckAnswer,
    oneOutOfThree: transformOneOutOfThreeAnswer,
} as const;

export function transformFormAnswers(
    formValues: Record<string, LessonElement>,
): useCaseModels.TAnswer[] {
    const answers: useCaseModels.TAnswer[] = [];

    for (const element of Object.values(formValues)) {
        const transformer =
            answerTransformers[element.type as keyof typeof answerTransformers];

        if (transformer) {
            try {
                const answer = transformer(element as any);
                answers.push(answer);
            } catch (error) {
                console.error(
                    `Error transforming answer for element ${element.id}:`,
                    error,
                );
                throw error;
            }
        } else {
            // Skip elements that don't need answer transformation (like richText, heading)
            console.log(
                `Skipping answer transformation for element type: ${element.type}`,
            );
        }
    }

    return answers;
}
