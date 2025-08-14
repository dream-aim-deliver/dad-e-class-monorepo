import { viewModels } from "@maany_shr/e-class-models";
import { RichTextFormComponent } from "@maany_shr/e-class-ui-kit";
import {
    FormElement,
    LessonElement,
} from '@maany_shr/e-class-ui-kit';
import { useMemo } from 'react';
import { getLessonComponentsMap } from '../../../utils/transform-lesson-components';


interface LessonFormProps {
    data: viewModels.TLessonComponentListSuccess;
}

export default function LessonForm({ data }: LessonFormProps) {
    const components = data.components;

    const formElements: Map<string, LessonElement> = useMemo(() => {
        return getLessonComponentsMap(components);
    }, [components]);

    return components.map((component) => {
        if (component.type === "richText") {
            const formElement = formElements.get(component.id) as FormElement | undefined;
            if (!formElement) return;
            return <RichTextFormComponent key={`component-${formElement.id}`} elementInstance={formElement} />
        }
    });
}