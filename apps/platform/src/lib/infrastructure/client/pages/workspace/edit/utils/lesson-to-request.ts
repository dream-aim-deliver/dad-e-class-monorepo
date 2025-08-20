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

const transformerPerType: Record<
    CourseElementType | FormElementType,
    (
        component: LessonElement,
        order: number,
    ) => useCaseModels.TSaveLessonComponentsRequest['components'][number]
> = {
    [CourseElementType.CoachingSession]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.Quiz]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.ImageFile]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.VideoFile]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.ImageGallery]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.DownloadFiles]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.UploadFiles]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.Assignment]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.QuizTypeOne]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.QuizTypeTwo]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.QuizTypeThree]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.QuizTypeFour]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [CourseElementType.Links]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [FormElementType.RichText]: transformRichText,
    [FormElementType.SingleChoice]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [FormElementType.MultiCheck]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [FormElementType.TextInput]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [FormElementType.HeadingText]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
    [FormElementType.OneOutOfThree]: function (
        component: LessonElement,
    ): useCaseModels.TSaveLessonComponentsRequest['components'][number] {
        throw new Error('Function not implemented.');
    },
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
