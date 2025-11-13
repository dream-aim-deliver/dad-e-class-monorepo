import { useCaseModels } from '@maany_shr/e-class-models';
import {
    FormElement,
    TextInputElement,
    SingleChoiceElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    PreAssessmentUploadFilesElement,
    LessonElement,
} from '@maany_shr/e-class-ui-kit';

function transformTextInputAnswer(
    element: TextInputElement,
): Extract<useCaseModels.TPreCourseAssessmentProgress, { type: 'textInput' }> {
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
): Extract<useCaseModels.TPreCourseAssessmentProgress, { type: 'singleChoice' }> {
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
): Extract<useCaseModels.TPreCourseAssessmentProgress, { type: 'multipleChoice' }> {
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
): Extract<useCaseModels.TPreCourseAssessmentProgress, { type: 'oneOutOfThree' }> {
    const answers: Array<{ rowId: string; columnId: string }> = [];

    console.log(`[OneOutOfThree Transform] Element ${element.id}:`, {
        totalRows: element.data.rows.length,
        rows: element.data.rows.map((r, idx) => ({
            index: idx,
            id: r.id,
            title: r.rowTitle,
            hasSelectedColumn: r.columns.some((col) => col.selected),
            selectedColumnId: r.columns.find((col) => col.selected)?.id,
        }))
    });

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

    console.log(`[OneOutOfThree Transform] Generated ${answers.length} answers:`, answers);

    return {
        componentId: element.id,
        type: 'oneOutOfThree',
        answers: answers,
    };
}

function transformUploadFilesAnswer(
    element: PreAssessmentUploadFilesElement,
): Extract<useCaseModels.TPreCourseAssessmentProgress, { type: 'uploadFiles' }> {
    if (!element.files || element.files.length === 0) {
        if (element.required) {
            throw new Error(`Upload files element ${element.id} is required but has no files`);
        }
        // Return empty progress for optional uploads
        return {
            componentId: element.id,
            type: 'uploadFiles',
            fileIds: [],
            comment: element.userComment || undefined,
        };
    }

    // Convert file IDs to numbers and validate
    const fileIds = element.files.map((file) => {
        const numericId = Number(file.id);
        if (isNaN(numericId)) {
            throw new Error(`Invalid file ID "${file.id}" for file "${file.name}". File ID must be numeric.`);
        }
        return numericId;
    });

    return {
        componentId: element.id,
        type: 'uploadFiles',
        fileIds,
        comment: element.userComment || undefined,
    };
}

const answerTransformers = {
    textInput: transformTextInputAnswer,
    singleChoice: transformSingleChoiceAnswer,
    multiCheck: transformMultiCheckAnswer,
    oneOutOfThree: transformOneOutOfThreeAnswer,
    uploadFiles: transformUploadFilesAnswer,
} as const;

export function transformFormAnswers(
    formValues: Record<string, LessonElement>,
): useCaseModels.TPreCourseAssessmentProgress[] {
    const answers: useCaseModels.TPreCourseAssessmentProgress[] = [];

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
        }
    }

    return answers;
}
