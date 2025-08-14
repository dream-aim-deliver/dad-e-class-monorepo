import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import {
    HeadingFormComponent,
    MultiCheckFormComponent,
    OneOutOfThreeFormComponent,
    RichTextFormComponent,
    SingleChoiceFormComponent,
    TextInputFormComponent,
} from '@maany_shr/e-class-ui-kit';
import { FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { JSX, useMemo, useRef } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

interface LessonFormProps {
    data: viewModels.TLessonComponentListSuccess;
}

interface ComponentRendererProps {
    key: string;
    formElement: LessonElement;
    elementProgress: React.RefObject<Map<string, LessonElement>>;
    component: useCaseModels.TLessonComponent;
    locale: TLocale;
}

function renderRichTextComponent({
    formElement,
    key,
}: ComponentRendererProps) {
    return <RichTextFormComponent key={key} elementInstance={formElement as FormElement} />;
}

function renderHeadingComponent({
    formElement,
    key,
}: ComponentRendererProps) {
    return <HeadingFormComponent key={key} elementInstance={formElement as FormElement} />;
}

function renderTextInputComponent({
    formElement,
    elementProgress,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <TextInputFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            locale={locale}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function renderSingleChoiceComponent({
    formElement,
    elementProgress,
    key,
}: ComponentRendererProps) {
    return (
        <SingleChoiceFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function renderMultiCheckComponent({
    formElement,
    elementProgress,
    key,
}: ComponentRendererProps) {
    return (
        <MultiCheckFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

function renderOneOutOfThreeComponent({
    formElement,
    elementProgress,
    key,
}: ComponentRendererProps) {
    return (
        <OneOutOfThreeFormComponent
            key={key}
            elementInstance={formElement as FormElement}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

const typeToRendererMap: Record<string, (props: ComponentRendererProps) => JSX.Element | null> = {
    richText: renderRichTextComponent,
    heading: renderHeadingComponent,
    textInput: renderTextInputComponent,
    multipleChoice: renderMultiCheckComponent,
    singleChoice: renderSingleChoiceComponent,
    oneOutOfThree: renderOneOutOfThreeComponent,
};

export default function LessonForm({ data }: LessonFormProps) {
    const components = data.components;
    const locale = useLocale() as TLocale;

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    const elementProgress = useRef(new Map([...formElements]));

    const renderComponent = (component: useCaseModels.TLessonComponent) => {
        const formElement = formElements.get(component.id) as
            | FormElement
            | undefined;
        if (!formElement) return null;

        const props: ComponentRendererProps = {
            formElement,
            elementProgress,
            component,
            locale,
            key: `component-${component.id}`,
        };

        const renderer = typeToRendererMap[component.type];
        if (renderer) {
            return renderer(props);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {components.map(renderComponent)}
        </div>
    );
}
