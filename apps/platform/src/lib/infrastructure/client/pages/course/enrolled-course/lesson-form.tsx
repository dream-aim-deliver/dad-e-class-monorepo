import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import {
    Button,
    FormElement,
    IconSave,
    LessonElement,
} from '@maany_shr/e-class-ui-kit';
import { useMemo, useRef } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import {
    ComponentRendererProps,
    typeToRendererMap,
} from '../../common/component-renderers';
import { trpc } from '../../../trpc/client';
import { FileUploadProvider } from '../utils/file-upload';
import { idToNumber } from '../../workspace/edit/utils/id-to-number';

interface LessonFormProps {
    lessonId: number;
    data: viewModels.TLessonComponentListSuccess;
    enableSubmit?: boolean;
}

const transformTextInput = (
    element: LessonElement,
): useCaseModels.TLessonProgress | undefined => {
    if (element.type !== 'textInput') {
        throw new Error('Invalid element type for text input transformation');
    }
    const isContentEmpty = !element.content || element.content.trim() === '';
    if (isContentEmpty) {
        if (element.required) {
            throw new Error(
                'Please fill in all required text inputs before submitting.',
            );
        }
        return undefined;
    }
    return {
        componentId: element.id,
        type: 'textInput',
        answer: element.content!,
    };
};

const transformSingleChoice = (
    element: LessonElement,
): useCaseModels.TLessonProgress | undefined => {
    if (element.type !== 'singleChoice') {
        throw new Error(
            'Invalid element type for single choice transformation',
        );
    }
    const answerId = element.options.find((opt) => opt.isSelected)?.id;
    if (!answerId) {
        if (element.required) {
            throw new Error(
                'Please select an option for all required single choice questions before submitting.',
            );
        }
        return undefined;
    }
    return {
        componentId: element.id,
        type: 'singleChoice',
        answerId: answerId,
    };
};

const transformMultiCheck = (
    element: LessonElement,
): useCaseModels.TLessonProgress | undefined => {
    if (element.type !== 'multiCheck') {
        throw new Error(
            'Invalid element type for multiple choice transformation',
        );
    }
    const selectedOptionIds = element.options
        .filter((opt) => opt.isSelected && opt.id !== undefined)
        .map((opt) => opt.id!);
    if (selectedOptionIds.length === 0) {
        if (element.required) {
            throw new Error(
                'Please select at least one option for all required multiple choice questions before submitting.',
            );
        }
        return undefined;
    }
    return {
        componentId: element.id,
        type: 'multipleChoice',
        answerIds: selectedOptionIds,
    };
};

const transformOneOutOfThree = (
    element: LessonElement,
): useCaseModels.TLessonProgress | undefined => {
    if (element.type !== 'oneOutOfThree') {
        throw new Error(
            'Invalid element type for one out of three transformation',
        );
    }
    const answers: { rowId: string; columnId: string }[] = [];
    for (const row of element.data.rows) {
        if (row.id === undefined) continue;
        const selectedOption = row.columns.find((col) => col.selected);
        if (selectedOption?.id === undefined) continue;
        if (selectedOption) {
            answers.push({ rowId: row.id, columnId: selectedOption.id });
        }
    }
    if (answers.length !== 3) {
        if (element.required) {
            throw new Error(
                'Please select one option from each row for all required questions before submitting.',
            );
        }
        return undefined;
    }
    return {
        componentId: element.id,
        type: 'oneOutOfThree',
        answers: answers,
    };
};

const transformFileUpload = (
    element: LessonElement,
): useCaseModels.TLessonProgress | undefined => {
    if (element.type !== 'uploadFiles') {
        throw new Error('Invalid element type for file upload transformation');
    }
    if (!element.files || element.files.length === 0) {
        if (element.required) {
            throw new Error(
                'Please upload at least one file for all required file upload components before submitting.',
            );
        }
        return undefined;
    }
    return {
        componentId: element.id,
        type: 'uploadFiles',
        fileIds: element.files.map((file) => idToNumber(file.id)!),
        comment: element.userComment,
    };
};

const typeToProgressTransformers: Record<
    string,
    (element: LessonElement) => useCaseModels.TLessonProgress | undefined
> = {
    textInput: transformTextInput,
    singleChoice: transformSingleChoice,
    multiCheck: transformMultiCheck,
    oneOutOfThree: transformOneOutOfThree,
    uploadFiles: transformFileUpload,
};

export default function LessonForm({
    lessonId,
    data,
    enableSubmit = false,
}: LessonFormProps) {
    const components = data.components;
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    const hasInteractiveElements = useMemo(() => {
        const interactiveTypes = Object.keys(typeToProgressTransformers);
        for (const component of components) {
            if (interactiveTypes.includes(component.type)) {
                return true;
            }
        }
        return false;
    }, [components]);

    const elementProgress = useRef(new Map([...formElements]));
    const submitProgressMutation = trpc.submitLessonProgresses.useMutation();
    // When implementing student submission, this will be used to track progress

    const renderComponent = (component: useCaseModels.TLessonComponent) => {
        const formElement = formElements.get(component.id) as
            | FormElement
            | undefined;
        if (!formElement) return null;

        const props: ComponentRendererProps = {
            formElement,
            elementProgress,
            locale,
            keyString: `component-${component.id}`,
        };

        const ComponentRenderer = typeToRendererMap[formElement.type];
        if (ComponentRenderer) {
            return (
                <ComponentRenderer
                    key={`component-renderer-${component.id}`}
                    {...props}
                />
            );
        }
    };

    const submitProgress = async () => {
        const progress: useCaseModels.TLessonProgress[] = [];
        for (const [_, element] of elementProgress.current) {
            try {
                const transformer = typeToProgressTransformers[element.type];
                if (!transformer) continue;
                const elementProgress = transformer(element);
                if (!elementProgress) continue;
                progress.push(elementProgress);
            } catch (error) {
                // TODO: Set error state
                return;
            }
        }

        submitProgressMutation.mutateAsync({
            lessonId: lessonId,
            progress: progress,
        });
    };

    const isSubmitting = submitProgressMutation.isPending;

    return (
        <FileUploadProvider
            mode={enableSubmit ? 'real' : 'mock'}
            config={{ lessonId: lessonId }}
        >
            <div className="flex flex-col gap-4 w-full">
                {components.map(renderComponent)}
                {enableSubmit && hasInteractiveElements && (
                    <Button
                        className='mx-auto'
                        variant="primary"
                        text={isSubmitting ? dictionary.pages.course.study.submitting : dictionary.pages.course.study.submit}
                        disabled={isSubmitting}
                        onClick={submitProgress}
                        hasIconLeft
                        iconLeft={<IconSave />}
                    />
                )}
            </div>
        </FileUploadProvider>
    );
}
