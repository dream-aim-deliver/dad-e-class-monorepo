import { viewModels } from '@maany_shr/e-class-models';
import {
    HeadingFormComponent,
    RichTextFormComponent,
    TextInputFormComponent,
} from '@maany_shr/e-class-ui-kit';
import { FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { useMemo, useRef } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

interface LessonFormProps {
    data: viewModels.TLessonComponentListSuccess;
}

interface ComponentRendererProps<T extends LessonElement = LessonElement> {
    key: string;
    formElement: FormElement;
    elementProgress: React.RefObject<Map<string, LessonElement>>;
    component: T;
    locale: TLocale;
}

function renderRichTextComponent({
    formElement,
    component,
    key,
}: ComponentRendererProps) {
    return <RichTextFormComponent key={key} elementInstance={formElement} />;
}

function renderHeadingComponent({
    formElement,
    component,
    key,
}: ComponentRendererProps) {
    return <HeadingFormComponent key={key} elementInstance={formElement} />;
}

function renderTextInputComponent({
    formElement,
    elementProgress,
    component,
    key,
    locale,
}: ComponentRendererProps) {
    return (
        <TextInputFormComponent
            key={key}
            elementInstance={formElement}
            locale={locale}
            submitValue={(id, element) => {
                elementProgress.current.set(id, element);
            }}
        />
    );
}

export default function LessonForm({ data }: LessonFormProps) {
    const components = data.components;
    const locale = useLocale() as TLocale;

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    const elementProgress = useRef(new Map([...formElements]));

    const renderComponent = (component: any) => {
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

        switch (component.type) {
            case 'richText':
                return renderRichTextComponent(props);
            case 'heading':
                return renderHeadingComponent(props);
            case 'textInput':
                return renderTextInputComponent(props);
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {components.map(renderComponent)}
        </div>
    );
}
