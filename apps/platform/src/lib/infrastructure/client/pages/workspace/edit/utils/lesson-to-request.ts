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
