'use client';

import React, { useRef } from 'react';
import {
    FormElementType,
    LessonElement,
    RichTextFormComponent,
    HeadingFormComponent,
    TextInputFormComponent,
    SingleChoiceFormComponent,
    MultiCheckFormComponent,
    OneOutOfThreeFormComponent,
    Divider,
} from '@maany_shr/e-class-ui-kit';
import { TLocale, isLocalAware } from '@maany_shr/e-class-translations';

export interface PreCourseAssessmentPreviewerProps extends isLocalAware {
    components: LessonElement[];
}

export function PreCourseAssessmentPreviewer({
    components,
    locale,
}: PreCourseAssessmentPreviewerProps) {
    const elementProgress = useRef(new Map<string, LessonElement>());

    const renderComponent = (formElement: LessonElement) => {
        const key = `component-${formElement.id}`;

        switch (formElement.type) {
            case FormElementType.RichText:
                return (
                    <RichTextFormComponent
                        key={key}
                        elementInstance={formElement}
                        locale={locale}
                    />
                );

            case FormElementType.HeadingText:
                return (
                    <HeadingFormComponent
                        key={key}
                        elementInstance={formElement}
                        locale={locale}
                    />
                );

            case FormElementType.TextInput:
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

            case FormElementType.SingleChoice:
                return (
                    <SingleChoiceFormComponent
                        key={key}
                        elementInstance={formElement}
                        locale={locale}
                        submitValue={(id, element) => {
                            elementProgress.current.set(id, element);
                        }}
                    />
                );

            case FormElementType.MultiCheck:
                return (
                    <MultiCheckFormComponent
                        key={key}
                        elementInstance={formElement}
                        locale={locale}
                        submitValue={(id, element) => {
                            elementProgress.current.set(id, element);
                        }}
                    />
                );

            case FormElementType.OneOutOfThree:
                return (
                    <OneOutOfThreeFormComponent
                        key={key}
                        elementInstance={formElement}
                        locale={locale}
                        submitValue={(id, element) => {
                            elementProgress.current.set(id, element);
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {components.map((component, index) => (
                <div key={component.id}>
                    {renderComponent(component)}
                    {index < components.length - 1 && (
                        <Divider className="mb-5 mt-5" />
                    )}
                </div>
            ))}
        </div>
    );
}

