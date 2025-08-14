import { useCaseModels } from '@maany_shr/e-class-models';
import {
    LessonElement,
    LessonElementType,
    FormElement,
    FormElementType,
    HeadingElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SingleChoiceElement,
    TextInputElement,
    VideoFileElement,
    ImageFileElement,
    DownloadFilesElement,
    UploadsFilesElement,
} from '@maany_shr/e-class-ui-kit';
import { TAnswer } from 'packages/models/src/usecase-models';

function transformRichText(
    component: Extract<useCaseModels.TLessonComponent, { type: 'richText' }>,
): RichTextElement {
    return {
        type: LessonElementType.RichText,
        order: component.order,
        id: component.id,
        content: component.text,
    };
}

function transformHeading(
    component: Extract<useCaseModels.TLessonComponent, { type: 'heading' }>,
): HeadingElement {
    return {
        type: LessonElementType.HeadingText,
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
        type: LessonElementType.SingleChoice,
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
        type: LessonElementType.MultiCheck,
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
        type: LessonElementType.TextInput,
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
        type: LessonElementType.OneOutOfThree,
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

function transformVideo(
    component: Extract<useCaseModels.TLessonComponent, { type: 'video' }>,
): VideoFileElement {
    return {
        type: LessonElementType.VideoFile,
        order: component.order,
        id: component.id,
        file: {
            id: component.videoFile.id,
            name: component.videoFile.name,
            size: component.videoFile.size,
            category: 'video',
            url: component.videoFile.downloadUrl,
            status: 'available',
            videoId: component.videoFile.playbackId,
            thumbnailUrl: component.videoFile.thumbnailUrl,
        },
    };
}

function transformImage(
    component: Extract<useCaseModels.TLessonComponent, { type: 'image' }>,
): ImageFileElement {
    return {
        type: LessonElementType.ImageFile,
        order: component.order,
        id: component.id,
        file: {
            id: component.imageFile.id,
            name: component.imageFile.name,
            size: component.imageFile.size,
            category: 'image',
            url: component.imageFile.downloadUrl,
            status: 'available',
            thumbnailUrl: component.imageFile.downloadUrl,
        },
    };
}

function transformDownloadFiles(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'downloadFiles' }
    >,
): DownloadFilesElement {
    return {
        type: LessonElementType.DownloadFiles,
        order: component.order,
        id: component.id,
        files: component.files.map((file) => ({
            id: file.id,
            name: file.name,
            size: file.size,
            category: 'generic', // TODO: find a way to pass category
            url: file.downloadUrl,
            status: 'available',
        })),
    };
}

function transformUploadFiles(
    component: Extract<useCaseModels.TLessonComponent, { type: 'uploadFiles' }>,
): UploadsFilesElement {
    return {
        type: LessonElementType.UploadFiles,
        order: component.order,
        id: component.id,
        description: component.description,
    };
}

const transformers = {
    richText: transformRichText,
    heading: transformHeading,
    singleChoice: transformSingleChoice,
    multipleChoice: transformMultipleChoice,
    textInput: transformTextInput,
    oneOutOfThree: transformOneOutOfThree,
    video: transformVideo,
    image: transformImage,
    downloadFiles: transformDownloadFiles,
    uploadFiles: transformUploadFiles,
} as const;

export function getLessonComponentsMap(
    components: useCaseModels.TLessonComponent[],
): Map<string, LessonElement> {
    const map = new Map<string, LessonElement>();

    components.forEach((component) => {
        const transformer = transformers[component.type];
        if (transformer) {
            const element = transformer(component as any);
            map.set(element.id, element);
        } else {
            // console.error(`Unknown component type: ${component.type}`);
        }
    });

    return map;
}

export function transformLessonComponents(
    components: useCaseModels.TLessonComponent[],
): LessonElement[] {
    const elements: LessonElement[] = [];

    for (const component of components) {
        const transformer = transformers[component.type];
        if (transformer) {
            const element = transformer(component as any);
            elements.push(element);
        } else {
            // console.error(`Unknown component type: ${component.type}`);
        }
    }

    return elements;
}

const applyTextInputProgress = (
    element: TextInputElement,
    answer: TAnswer,
): void => {
    if (answer.type === 'textInput') {
        // @ts-expect-error As TextInput might not have content, being a joint type, ignore typing to assign it
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

const progressAppliers: Record<
    FormElementType,
    ((element: any, answer: TAnswer) => void) | undefined
> = {
    [FormElementType.TextInput]: applyTextInputProgress,
    [FormElementType.SingleChoice]: applySingleChoiceProgress,
    [FormElementType.MultiCheck]: applyMultiCheckProgress,
    [FormElementType.OneOutOfThree]: applyOneOutOfThreeProgress,
    [FormElementType.RichText]: undefined,
    [FormElementType.HeadingText]: undefined,
} as const;

export function applyProgressToElements(
    elements: LessonElement[],
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
                applier(element, answer);
            }
        }
        return element;
    });
}

export function transformLessonComponentsWithProgress(
    components: useCaseModels.TLessonComponent[],
    answers: TAnswer[],
): LessonElement[] {
    const elements = transformLessonComponents(components);
    applyProgressToElements(elements, answers);
    return elements;
}
