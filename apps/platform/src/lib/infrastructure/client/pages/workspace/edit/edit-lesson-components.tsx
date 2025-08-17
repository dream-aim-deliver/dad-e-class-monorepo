import React from 'react';
import { useLessonComponents } from './hooks/edit-lesson-hooks';
import {
    FormElementType,
    LessonElement,
    RichTextDesignerComponent,
    RichTextElement,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';

interface EditLessonComponentsProps {
    lessonId: number;
    components: LessonElement[];
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
}

interface LessonComponentProps {
    elementInstance: LessonElement;
    locale: TLocale;
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
}

function RichTextComponent({
    elementInstance: element,
    locale,
    setComponents,
}: LessonComponentProps) {
    return (
        <RichTextDesignerComponent
            elementInstance={element as RichTextElement}
            locale={locale}
            onUpClick={() => {}}
            onDownClick={() => {}}
            onDeleteClick={() => {}}
            onContentChange={(value: string) => {
                setComponents((prev) =>
                    prev.map((comp) =>
                        comp.id === element.id
                            ? { ...comp, content: value }
                            : comp,
                    ),
                );
            }}
        />
    );
}

const typeToRendererMap: Record<any, React.FC<LessonComponentProps>> = {
    [FormElementType.RichText]: RichTextComponent,
    // Add other mappings as needed
};

export default function EditLessonComponents({
    lessonId,
    components,
    setComponents,
    courseVersion,
    setCourseVersion,
}: EditLessonComponentsProps) {
    const lessonComponentsViewModel = useLessonComponents(lessonId);

    console.log(components);

    const locale = useLocale() as TLocale;

    return <div className="flex flex-col gap-2">
        {components.map((component) => {
            const Component = typeToRendererMap[component.type];
            return (
                <Component
                    key={component.id}
                    elementInstance={component}
                    locale={locale}
                    setComponents={setComponents}
                />
            );
        })} 
    </div>;
}
