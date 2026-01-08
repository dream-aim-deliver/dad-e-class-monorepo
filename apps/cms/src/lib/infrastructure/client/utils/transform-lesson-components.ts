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
    QuizTypeOneElement,
    QuizTypeTwoElement,
    QuizTypeThreeElement,
    QuizTypeFourElement,
    LinksElement,
    CoachingSessionElement,
    CourseElementType,
    AssignmentElement,
} from '@maany_shr/e-class-ui-kit';
import { TPreCourseAssessmentProgress } from 'packages/models/src/usecase-models';

function transformRichText(
    component: Extract<useCaseModels.TLessonComponent, { type: 'richText' }>,
): RichTextElement {
    return {
        type: LessonElementType.RichText,
        id: component.id,
        content: component.text,
        includeInMaterials: component.includeInMaterials,
    };
}

function transformHeading(
    component: Extract<useCaseModels.TLessonComponent, { type: 'heading' }>,
): HeadingElement {
    return {
        type: LessonElementType.HeadingText,
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
    const selectedId = component.progress?.answerId;

    return {
        type: LessonElementType.SingleChoice,
        id: component.id,
        title: component.title,
        options: component.options.map((option) => ({
            id: option.id,
            name: option.name,
            isSelected: selectedId !== undefined && option.id === selectedId,
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
        id: component.id,
        title: component.title,
        options: component.options.map((option) => {
            const isSelected = component.progress?.answerIds.includes(option.id);
            return {
                id: option.id,
                name: option.name,
                isSelected: isSelected ?? false,
            };
        }),
        required: component.required,
    };
}

function transformTextInput(
    component: Extract<useCaseModels.TLessonComponent, { type: 'textInput' }>,
): TextInputElement {
    return {
        type: LessonElementType.TextInput,
        id: component.id,
        helperText: component.helperText,
        required: component.required,
        content: component.progress?.answer,
    };
}

function transformOneOutOfThree(
    component: Extract<
        useCaseModels.TLessonComponent,
        { type: 'oneOutOfThree' }
    >,
): OneOutOfThreeElement {
    return {
        type: LessonElementType.OneOutOfThree,
        id: component.id,
        data: {
            tableTitle: component.title,
            rows: component.rows.map((row) => {
                const columns = component.columns.map((column) => {
                    const isSelected = component.progress?.answers.some(
                        (a) => a.rowId === row.id && a.columnId === column.id
                    );
                    return {
                        id: column.id,
                        columnTitle: column.name,
                        selected: isSelected || false,
                    };
                });
                return {
                    id: row.id,
                    rowTitle: row.name,
                    columns: columns,
                };
            }),
            columns: component.columns.map((column) => ({
                id: column.id,
                columnTitle: column.name,
                selected: false
            }))
        },
        required: component.required,
    };
};

function transformVideo(
    component: Extract<useCaseModels.TLessonComponent, { type: 'video' }>,
): VideoElement {
    return {
        type: LessonElementType.VideoFile,
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
        id: component.id,
        files: component.files.map((file) => ({
            id: file.id,
            name: file.name,
            size: file.size,
            category: 'generic', // TODO: find a way to pass category
            url: file.downloadUrl,
            status: 'available',
            thumbnailUrl: file.downloadUrl,
        })),
    };
}

function transformUploadFiles(
    component: Extract<useCaseModels.TLessonComponent, { type: 'uploadFiles' }>,
): UploadFilesElement {
    return {
        type: LessonElementType.UploadFiles,
        id: component.id,
        description: component.description,
        files: component.progress?.files.map((file) => ({
            ...file,
            url: file.downloadUrl,
            status: 'available',
            thumbnailUrl: file.downloadUrl,
            category: 'generic',
        })) ?? null,
        userComment: component.progress?.comment,
    };
}

function transformQuizTypeOne(
    component: Extract<useCaseModels.TLessonComponent, { type: 'quizTypeOne' }>,
): QuizTypeOneElement {
    return {
        type: LessonElementType.QuizTypeOne,
        id: component.id,
        title: component.title,
        description: component.description,
        options: component.options.map((option) => ({
            id: option.id,
            name: option.name,
            correct: option.id === component.correctOptionId,
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
): QuizTypeTwoElement {
    return {
        type: LessonElementType.QuizTypeTwo,
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
                correct: option.id === group.correctOptionId,
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
): QuizTypeThreeElement {
    return {
        type: LessonElementType.QuizTypeThree,
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
            correct: option.id === component.correctOptionId,
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
): QuizTypeFourElement {
    return {
        type: LessonElementType.QuizTypeFour,
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
        includeInMaterials: component.includeInMaterials,
        asPartOfMaterialsOnly: component.asPartOfMaterialsOnly,
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
        id: component.id,
        coachingSession: {
            id: component.courseCoachingOfferingId,
            name: component.name,
            duration: component.duration,
        },
    };
}

function transformAssignment(
    component: Extract<useCaseModels.TLessonComponent, { type: 'assignment' }>,
): AssignmentElement {
    return {
        type: LessonElementType.Assignment,
        id: component.id,
        title: component.title,
        description: component.description,
        files: component.resources.map((file) => ({
            ...file,
            status: 'available',
            category: 'generic',
            url: file.downloadUrl,
        })),
        links: component.links,
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
    assignment: transformAssignment,
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
    answer: TPreCourseAssessmentProgress,
): void => {
    if (answer.type === 'textInput') {
        element.content = answer.answer;
    }
};

const applySingleChoiceProgress = (
    element: SingleChoiceElement,
    answer: TPreCourseAssessmentProgress,
): void => {
    if (answer.type === 'singleChoice') {
        element.options.forEach((option) => {
            option.isSelected = answer.answerId === option.id;
        });
    }
};

const applyMultiCheckProgress = (
    element: MultiCheckElement,
    answer: TPreCourseAssessmentProgress,
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
    answer: TPreCourseAssessmentProgress,
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
    ((element: any, answer: TPreCourseAssessmentProgress) => void) | undefined
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
    answers: TPreCourseAssessmentProgress[],
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
    answers: TPreCourseAssessmentProgress[],
): LessonElement[] {
    const elements = transformLessonComponents(components);
    applyProgressToElements(elements, answers);
    return elements;
}
