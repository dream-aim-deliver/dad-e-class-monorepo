import { useCaseModels } from '@maany_shr/e-class-models';
import {
    CourseElementType,
    FormElementType,
    LessonElement,
} from '@maany_shr/e-class-ui-kit';
import { extractId } from './generate-temp-id';
import { idToNumber } from './id-to-number';

type RequestComponent =
    useCaseModels.TSaveLessonComponentsRequest['components'][number];

function transformRichText(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'richText' }> {
    if (component.type !== FormElementType.RichText) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'richText',
        position: order,
        text: component.content,
        includeInMaterials: false,
    };
}

function transformHeading(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'heading' }> {
    if (component.type !== FormElementType.HeadingText) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'heading',
        position: order,
        text: component.heading,
        size: component.headingType as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    };
}

function transformTextInput(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'textInput' }> {
    if (component.type !== FormElementType.TextInput) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'textInput',
        position: order,
        helperText: component.helperText,
        required: component.required ?? false,
    };
}

function transformSingleChoice(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'singleChoice' }> {
    if (component.type !== FormElementType.SingleChoice) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'singleChoice',
        position: order,
        title: component.title,
        options: component.options.map((option, index) => ({
            id: String(index + 1),
            name: option.name,
        })),
        required: component.required ?? false,
    };
}

function transformMultipleChoice(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'multipleChoice' }> {
    if (component.type !== FormElementType.MultiCheck) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'multipleChoice',
        position: order,
        title: component.title,
        options: component.options.map((option, index) => ({
            id: String(index + 1),
            name: option.name,
        })),
        required: component.required ?? false,
    };
}

function transformOneOutOfThree(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'oneOutOfThree' }> {
    if (component.type !== FormElementType.OneOutOfThree) {
        throw new Error('Invalid component type');
    }

    // Extract unique column titles from all rows
    const columnSet = new Set<string>();
    component.data.rows.forEach((row) => {
        row.columns.forEach((column) => {
            columnSet.add(column.columnTitle);
        });
    });

    return {
        id: extractId(component.id),
        type: 'oneOutOfThree',
        position: order,
        title: component.data.tableTitle,
        columns: Array.from(columnSet).map((name, index) => ({ name, id: String(index + 1) })),
        rows: component.data.rows.map((row, index) => ({
            name: row.rowTitle,
            id: String(index + 1),
        })),
        required: component.required ?? false,
    };
}

function transformVideo(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'video' }> {
    if (component.type !== CourseElementType.VideoFile) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'video',
        position: order,
        videoFileId: idToNumber(component.file!.id)!,
    };
}

function transformImage(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'image' }> {
    if (component.type !== CourseElementType.ImageFile) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'image',
        position: order,
        imageFileId: idToNumber(component.file!.id)!,
    };
}

function transformImageCarousel(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'imageCarousel' }> {
    if (component.type !== CourseElementType.ImageGallery) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'imageCarousel',
        position: order,
        imageFileIds: component.images!.map((image) => idToNumber(image.id)!),
    };
}

function transformLinks(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'links' }> {
    if (component.type !== CourseElementType.Links) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'links',
        position: order,
        links: component.links.map((link) => ({
            title: link.title,
            url: link.url,
            iconFileId: idToNumber(link.customIcon?.id),
        })),
        includeInMaterials: true,
    };
}

function transformDownloadFiles(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'downloadFiles' }> {
    if (component.type !== CourseElementType.DownloadFiles) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'downloadFiles',
        position: order,
        fileIds: component.files!.map((file) => idToNumber(file.id)!),
    };
}

function transformUploadFiles(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'uploadFiles' }> {
    if (component.type !== CourseElementType.UploadFiles) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'uploadFiles',
        position: order,
        description: component.description || '',
    };
}

function transformQuizTypeOne(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'quizTypeOne' }> {
    if (component.type !== CourseElementType.QuizTypeOne) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'quizTypeOne',
        position: order,
        title: component.title,
        description: component.description,
        imageFileId: idToNumber(component.imageFile!.id)!,
        options: component.options.map((option,index) => ({
            id: String(index + 1),
            name: option.name,
        })),
        correctOptionId: String(component.options.findIndex((option) => option.correct) + 1),
    };
}

function transformQuizTypeTwo(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'quizTypeTwo' }> {
    if (component.type !== CourseElementType.QuizTypeTwo) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'quizTypeTwo',
        position: order,
        title: component.title,
        description: component.description,
        imageFileId: idToNumber(component.imageFile!.id)!,
        groups: component.groups.map((group, index) => ({
            id: String(index + 1),
            title: group.title,
            options: group.options.map((option, index) => ({
                id: String(index + 1),
                name: option.name,
            })),
            correctOptionId: String(group.options.findIndex((option) => option.correct) + 1),
        })),
    };
}

function transformQuizTypeThree(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'quizTypeThree' }> {
    if (component.type !== CourseElementType.QuizTypeThree) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'quizTypeThree',
        position: order,
        title: component.title,
        description: component.description,
        options: component.options.map((option, index) => ({
            id: String(index + 1),
            imageFileId: idToNumber(option.imageFile!.id)!,
            description: option.description,
        })),
        correctOptionId: String(component.options.findIndex((option) => option.correct) + 1),
    };
}

function transformQuizTypeFour(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'quizTypeFour' }> {
    if (component.type !== CourseElementType.QuizTypeFour) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'quizTypeFour',
        position: order,
        title: component.title,
        description: component.description,
        options: component.images.map((image, index) => ({
            id: String(index + 1),
            imageFileId: idToNumber(image.imageFile!.id)!,
            description:
                component.labels.find(
                    (label) => label.letter === image.correctLetter,
                )?.description || '',
        })),
    };
}

function transformCoachingSession(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'coachingSession' }> {
    if (component.type !== CourseElementType.CoachingSession) {
        throw new Error('Invalid component type');
    }

    return {
        id: extractId(component.id),
        type: 'coachingSession',
        position: order,
        courseCoachingOfferingId: component.coachingSession!.id,
    };
}

function transformAssignment(
    component: LessonElement,
    order: number,
): Extract<RequestComponent, { type: 'assignment' }> {
    if (component.type !== CourseElementType.Assignment) {
        throw new Error('Invalid component type');
    }

    const fileIds = [];
    for (const file of component.files ?? []) {
        const id = idToNumber(file.id);
        if (!id) continue;
        fileIds.push(id);
    }

    return {
        id: extractId(component.id),
        type: 'assignment',
        position: order,
        title: component.title,
        description: component.description,
        fileIds: fileIds,
        links:
            component.links?.map((link) => ({
                title: link.title,
                url: link.url,
                iconFileId: idToNumber(link.customIcon?.id),
            })) ?? [],
    };
}

const transformerPerType: Record<
    CourseElementType | FormElementType,
    (
        component: LessonElement,
        order: number,
    ) => useCaseModels.TSaveLessonComponentsRequest['components'][number]
> = {
    [CourseElementType.CoachingSession]: transformCoachingSession,
    [CourseElementType.ImageFile]: transformImage,
    [CourseElementType.VideoFile]: transformVideo,
    [CourseElementType.ImageGallery]: transformImageCarousel,
    [CourseElementType.DownloadFiles]: transformDownloadFiles,
    [CourseElementType.UploadFiles]: transformUploadFiles,
    [CourseElementType.Assignment]: transformAssignment,
    [CourseElementType.QuizTypeOne]: transformQuizTypeOne,
    [CourseElementType.QuizTypeTwo]: transformQuizTypeTwo,
    [CourseElementType.QuizTypeThree]: transformQuizTypeThree,
    [CourseElementType.QuizTypeFour]: transformQuizTypeFour,
    [CourseElementType.Links]: transformLinks,
    [FormElementType.RichText]: transformRichText,
    [FormElementType.SingleChoice]: transformSingleChoice,
    [FormElementType.MultiCheck]: transformMultipleChoice,
    [FormElementType.TextInput]: transformTextInput,
    [FormElementType.HeadingText]: transformHeading,
    [FormElementType.OneOutOfThree]: transformOneOutOfThree,
};

export function transformLessonToRequest(
    components: LessonElement[],
): RequestComponent[] {
    const requestComponents = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const transformFunction = transformerPerType[component.type];
        if (!transformFunction) {
            throw new Error(
                `No transform function found for component type: ${component.type}`,
            );
        }
        const order = i + 1;
        requestComponents.push(transformFunction(component, order));
    }
    return requestComponents;
}
