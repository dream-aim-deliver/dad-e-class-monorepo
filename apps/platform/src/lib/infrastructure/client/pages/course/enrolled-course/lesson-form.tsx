import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { FormElement, LessonElement } from '@maany_shr/e-class-ui-kit';
import { useMemo, useRef } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    ComponentRendererProps,
    typeToRendererMap,
} from '../../common/component-renderers';

interface LessonFormProps {
    data: viewModels.TLessonComponentListSuccess;
}

export default function LessonForm({ data }: LessonFormProps) {
    const components = data.components;
    const locale = useLocale() as TLocale;

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    const elementProgress = useRef(new Map([...formElements]));
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
            key: `component-${component.id}`,
        };

        const renderer = typeToRendererMap[formElement.type];
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
