import { useCaseModels } from '@maany_shr/e-class-models';
import {
    CourseElementType,
    FormElementType,
    LessonElement,
} from '@maany_shr/e-class-ui-kit';

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
        id: component.id,
        type: 'richText',
        order: order,
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
        id: component.id,
        type: 'heading',
        order: order,
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
        id: component.id,
        type: 'textInput',
        order: order,
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
        id: component.id,
        type: 'singleChoice',
        order: order,
        title: component.title,
        options: component.options.map((option) => ({
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
        id: component.id,
        type: 'multipleChoice',
        order: order,
        title: component.title,
        options: component.options.map((option) => ({
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
        id: component.id,
        type: 'oneOutOfThree',
        order: order,
        title: component.data.tableTitle,
        columns: Array.from(columnSet).map((name) => ({ name })),
        rows: component.data.rows.map((row) => ({
            name: row.rowTitle,
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
        id: component.id,
        type: 'video',
        order: order,
        videoFileId: component.file!.id,
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
        id: component.id,
        type: 'image',
        order: order,
        imageFileId: component.file!.id,
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
        id: component.id,
        type: 'imageCarousel',
        order: order,
        imageFileIds: component.images!.map((image) => image.id),
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
        id: component.id,
        type: 'links',
        order: order,
        links: component.links.map((link) => ({
            title: link.title,
            url: link.url,
            iconFileId: link.customIcon?.id || null,
        })),
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
        id: component.id,
        type: 'downloadFiles',
        order: order,
        fileIds: component.files!.map((file) => file.id),
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
        id: component.id,
        type: 'uploadFiles',
        order: order,
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
        id: component.id,
        type: 'quizTypeOne',
        order: order,
        title: component.title,
        description: component.description,
        imageFileId: component.imageFile!.id,
        options: component.options.map((option) => ({
            name: option.name,
            isCorrect: option.correct || false,
        })),
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
        id: component.id,
        type: 'quizTypeTwo',
        order: order,
        title: component.title,
        description: component.description,
        imageFileId: component.imageFile!.id,
        groups: component.groups.map((group) => ({
            title: group.title,
            options: group.options.map((option) => ({
                name: option.name,
                isCorrect: option.correct || false,
            })),
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
        id: component.id,
        type: 'quizTypeThree',
        order: order,
        title: component.title,
        description: component.description,
        options: component.options.map((option) => ({
            imageFileId: option.imageFile!.id,
            description: option.description,
            isCorrect: option.correct,
        })),
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
        id: component.id,
        type: 'quizTypeFour',
        order: order,
        title: component.title,
        description: component.description,
        options: component.images.map((image) => ({
            imageFileId: image.imageFile!.id,
            description:
                component.labels.find(
                    (label) => label.letter === image.correctLetter,
                )?.description || '',
        })),
    };
}

const transformerPerType: Record<
    CourseElementType | FormElementType,
    (
        component: LessonElement,
        order: number,
    ) => useCaseModels.TSaveLessonComponentsRequest['components'][number]
> = {
    [CourseElementType.CoachingSession]: () => {
        // TODO: Implement transformation for CoachingSession
        throw new Error('Function not implemented.');
    },
    [CourseElementType.ImageFile]: transformImage,
    [CourseElementType.VideoFile]: transformVideo,
    [CourseElementType.ImageGallery]: transformImageCarousel,
    [CourseElementType.DownloadFiles]: transformDownloadFiles,
    [CourseElementType.UploadFiles]: transformUploadFiles,
    [CourseElementType.Assignment]: () => {
        // TODO: Implement transformation for Assignment
        throw new Error('Function not implemented.');
    },
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
