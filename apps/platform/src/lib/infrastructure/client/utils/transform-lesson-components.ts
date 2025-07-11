import { useCaseModels } from '@maany_shr/e-class-models';
import {
    FormElement,
    FormElementType,
    HeadingElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SingleChoiceElement,
    TextInputElement,
} from '@maany_shr/e-class-ui-kit';
import { TAnswer } from 'packages/models/src/usecase-models';

function transformRichText(
    component: Extract<useCaseModels.TLessonComponent, { type: 'richText' }>,
): RichTextElement {
    return {
        type: FormElementType.RichText,
        order: component.order,
        id: component.id,
        content: component.text,
    };
}

function transformHeading(
    component: Extract<useCaseModels.TLessonComponent, { type: 'heading' }>,
): HeadingElement {
    return {
        type: FormElementType.HeadingText,
        order: component.order,
        id: component.id,
        heading: component.text,
        headingType: component.size,
    };
}

function transformSingleChoice(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'singleChoice' }
    >,
): SingleChoiceElement {
    return {
        type: FormElementType.SingleChoice,
        order: component.order,
        id: component.id,
        title: component.title,
        options: component.options.map((option) => ({
            id: option.id,
            name: option.name,
            isSelected: false,
        })),
        required: component.required,
    };
}

function transformMultipleChoice(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'multipleChoice' }
    >,
): MultiCheckElement {
    return {
        type: FormElementType.MultiCheck,
        order: component.order,
        id: component.id,
        title: component.title,
        options: component.options.map((option) => ({
            id: option.id,
            name: option.name,
            isSelected: false,
        })),
        required: component.required,
    };
}

function transformTextInput(
    component: Extract<useCaseModels.TLessonComponent, { type: 'textInput' }>,
): TextInputElement {
    return {
        type: FormElementType.TextInput,
        order: component.order,
        id: component.id,
        helperText: component.helperText,
        required: component.required,
    };
}

function transformOneOutOfThree(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'oneOutOfThree' }
    >,
): OneOutOfThreeElement {
    const columns = component.columns.map((column) => ({
        id: column.id,
        columnTitle: column.name,
        selected: false,
    }));

    return {
        type: FormElementType.OneOutOfThree,
        order: component.order,
        id: component.id,
        data: {
            tableTitle: component.title,
            rows: component.rows.map((row) => ({
                id: row.id,
                rowTitle: row.name,
                columns: structuredClone(columns),
            })),
        },
        required: component.required,
    };
}

const transformers = {
    richText: transformRichText,
    heading: transformHeading,
    singleChoice: transformSingleChoice,
    multipleChoice: transformMultipleChoice,
    textInput: transformTextInput,
    oneOutOfThree: transformOneOutOfThree,
} as const;

export function transformLessonComponents(
    components: useCaseModels.TLessonComponent[],
): FormElement[] {
    const elements: FormElement[] = [];

    for (const component of components) {
        const transformer = transformers[component.type];
        if (transformer) {
            const element = transformer(component as any);
            elements.push(element);
        } else {
            console.error(`Unknown component type: ${component.type}`);
        }
    }

    return elements;
}

const applyTextInputProgress = (
    element: TextInputElement,
    answer: TAnswer,
): void => {
    if (answer.type === 'textInput') {
        // As TextInput might not have content, being a joint type, ignore typing to assign it
        // @ts-ignore
        element.content = answer.answer;
    }
};

const applySingleChoiceProgress = (
    element: SingleChoiceElement,
    answer: TAnswer,
): void => {
    if (answer.type === 'singleChoice') {
        element.options.forEach((option) => {
            option.isSelected = answer.answerId === option.id;
        });
    }
};

const applyMultiCheckProgress = (
    element: MultiCheckElement,
    answer: TAnswer,
): void => {
    if (answer.type === 'multipleChoice') {
        element.options.forEach((option) => {
            if (option.id !== undefined) {
                option.isSelected = answer.answerIds.includes(option.id);
            }
        });
    }
};

const applyOneOutOfThreeProgress = (
    element: OneOutOfThreeElement,
    answer: TAnswer,
): void => {
    if (answer.type === 'oneOutOfThree') {
        for (const row of element.data.rows) {
            for (const column of row.columns) {
                column.selected = answer.answers.some(
                    (a) => a.rowId === row.id && a.columnId === column.id,
                );
            }
        }
    }
};

const progressAppliers = {
    [FormElementType.TextInput]: applyTextInputProgress,
    [FormElementType.SingleChoice]: applySingleChoiceProgress,
    [FormElementType.MultiCheck]: applyMultiCheckProgress,
    [FormElementType.OneOutOfThree]: applyOneOutOfThreeProgress,
    [FormElementType.RichText]: () => {}, // No progress to apply
    [FormElementType.HeadingText]: () => {}, // No progress to apply
} as const;

export function applyProgressToElements(
    elements: FormElement[],
    answers: TAnswer[],
): void {
    const answersMap = new Map(
        answers.map((answer) => [answer.componentId, answer]),
    );

    elements.forEach((element) => {
        const answer = answersMap.get(element.id);
        if (answer) {
            const applier = progressAppliers[element.type];
            if (applier) {
                applier(element as any, answer);
            }
        }
        return element;
    });
}

export function transformLessonComponentsWithProgress(
    components: useCaseModels.TLessonComponent[],
    answers: TAnswer[],
): FormElement[] {
    const elements = transformLessonComponents(components);
    applyProgressToElements(elements, answers);
    return elements;
}
