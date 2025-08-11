import { useCaseModels } from '@maany_shr/e-class-models';
import {
    LessonElement,
    LessonElementType,
    FormElementType,
    HeadingElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SingleChoiceElement,
    TextInputElement,
    VideoElement,
    ImageElement,
    DownloadFilesElement,
    UploadFilesElement,
    ImageGallery as ImageGalleryElement,
    TempQuizTypeOneElement,
    TempQuizTypeTwoElement,
    TempQuizTypeThreeElement,
    TempQuizTypeFourElement,
    LinksElement,
    CoachingSessionElement,
    CourseElementType,
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
): VideoElement {
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
): ImageElement {
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

function transformImageCarousel(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'imageCarousel' }
    >,
): ImageGalleryElement {
    return {
        type: LessonElementType.ImageGallery,
        order: component.order,
        id: component.id,
        images: component.imageFiles.map((image) => ({
            id: image.id,
            name: image.name,
            size: image.size,
            category: 'image',
            url: image.downloadUrl,
            status: 'available',
            thumbnailUrl: image.downloadUrl,
        })),
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
): UploadFilesElement {
    return {
        type: LessonElementType.UploadFiles,
        order: component.order,
        id: component.id,
        description: component.description,
        files: null,
    };
}

function transformQuizTypeOne(
    component: Extract<useCaseModels.TLessonComponent, { type: 'quizTypeOne' }>,
): TempQuizTypeOneElement {
    return {
        type: LessonElementType.QuizTypeOne,
        order: component.order,
        id: component.id,
        title: component.title,
        description: component.description,
        options: component.options.map((option) => ({
            id: option.id,
            name: option.name,
            isSelected: false,
        })),
        imageFile: {
            ...component.imageFile,
            url: component.imageFile.downloadUrl,
            status: 'available',
            thumbnailUrl: component.imageFile.downloadUrl,
        },
        correctOptionId: component.correctOptionId,
    };
}

function transformQuizTypeTwo(
    component: Extract<useCaseModels.TLessonComponent, { type: 'quizTypeTwo' }>,
): TempQuizTypeTwoElement {
    return {
        type: LessonElementType.QuizTypeTwo,
        order: component.order,
        id: component.id,
        title: component.title,
        description: component.description,
        imageFile: {
            ...component.imageFile,
            url: component.imageFile.downloadUrl,
            status: 'available',
            thumbnailUrl: component.imageFile.downloadUrl,
        },
        groups: component.groups.map((group) => ({
            id: group.id,
            title: group.title,
            options: group.options.map((option) => ({
                id: option.id,
                name: option.name,
            })),
            correctOptionId: group.correctOptionId,
        })),
    };
}

function transformQuizTypeThree(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'quizTypeThree' }
    >,
): TempQuizTypeThreeElement {
    return {
        type: LessonElementType.QuizTypeThree,
        order: component.order,
        id: component.id,
        title: component.title,
        description: component.description,
        options: component.options.map((option) => ({
            id: option.id,
            imageFile: {
                ...option.imageFile,
                url: option.imageFile.downloadUrl,
                status: 'available',
                thumbnailUrl: option.imageFile.downloadUrl,
            },
            description: option.description,
        })),
        correctOptionId: component.correctOptionId,
    };
}

const getLetterByIndex = (index: number) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
};

function transformQuizTypeFour(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'quizTypeFour' }
    >,
): TempQuizTypeFourElement {
    return {
        type: LessonElementType.QuizTypeFour,
        order: component.order,
        id: component.id,
        title: component.title,
        description: component.description,
        images: component.options.map((option, idx) => ({
            imageFile: {
                ...option.imageFile,
                url: option.imageFile.downloadUrl,
                status: 'available',
                thumbnailUrl: option.imageFile.downloadUrl,
            },
            correctLetter: getLetterByIndex(idx),
        })),
        labels: component.options.map((option, idx) => ({
            letter: getLetterByIndex(idx),
            description: option.description,
        })),
    };
}

function transformLinks(
    component: Extract<useCaseModels.TLessonComponent, { type: 'links' }>,
): LinksElement {
    return {
        type: LessonElementType.Links,
        order: component.order,
        id: component.id,
        links: component.links.map((link) => ({
            title: link.title,
            url: link.url,
            customIcon: link.iconFile
                ? {
                      ...link.iconFile,
                      status: 'available',
                      url: link.iconFile?.downloadUrl,
                      thumbnailUrl: link.iconFile?.downloadUrl,
                  }
                : undefined,
        })),
    };
}

function transformCoachingSession(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'coachingSession' }
    >,
): CoachingSessionElement {
    return {
        type: LessonElementType.CoachingSession,
        order: component.order,
        id: component.id,
        coachingSession: {
            id: component.courseCoachingOfferingId,
            name: component.name,
            duration: component.duration,
        },
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
    imageCarousel: transformImageCarousel,
    quizTypeOne: transformQuizTypeOne,
    quizTypeTwo: transformQuizTypeTwo,
    quizTypeThree: transformQuizTypeThree,
    quizTypeFour: transformQuizTypeFour,
    links: transformLinks,
    coachingSession: transformCoachingSession,
    assignment: undefined,
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
    FormElementType | CourseElementType,
    ((element: any, answer: TAnswer) => void) | undefined
> = {
    [FormElementType.TextInput]: applyTextInputProgress,
    [FormElementType.SingleChoice]: applySingleChoiceProgress,
    [FormElementType.MultiCheck]: applyMultiCheckProgress,
    [FormElementType.OneOutOfThree]: applyOneOutOfThreeProgress,
    [FormElementType.RichText]: undefined,
    [FormElementType.HeadingText]: undefined,
    [CourseElementType.VideoFile]: undefined,
    [CourseElementType.ImageFile]: undefined,
    [CourseElementType.ImageGallery]: undefined,
    [CourseElementType.DownloadFiles]: undefined,
    [CourseElementType.UploadFiles]: undefined,
    [CourseElementType.Quiz]: undefined,
    [CourseElementType.QuizTypeOne]: undefined,
    [CourseElementType.QuizTypeTwo]: undefined,
    [CourseElementType.QuizTypeThree]: undefined,
    [CourseElementType.QuizTypeFour]: undefined,
    [CourseElementType.Links]: undefined,
    [CourseElementType.CoachingSession]: undefined,
    [CourseElementType.Assignment]: undefined,
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
