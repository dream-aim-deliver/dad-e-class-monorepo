'use client';

import React, { useRef } from 'react';
import { FormElementType } from '../pre-assessment/types';
import { LessonElement } from '../lesson/types';
import { FormComponent as RichTextFormComponent } from '../lesson-components/rich-text';
import { FormComponent as HeadingFormComponent } from '../lesson-components/heading-lesson';
import { FormComponent as TextInputFormComponent } from '../lesson-components/text-input';
import { FormComponent as SingleChoiceFormComponent } from '../lesson-components/single-choice';
import { FormComponent as MultiCheckFormComponent } from '../lesson-components/multi-check';
import { FormComponent as OneOutOfThreeFormComponent } from '../lesson-components/one-out-of-three';
import { FormComponent as UploadFilesFormComponent } from '../lesson-components/upload-files';
import { Divider } from '../divider';
import { isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

export interface PreCourseAssessmentPreviewerProps extends isLocalAware {
    components: LessonElement[];
    onFileUpload?: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        componentId: string,
        courseSlug: string,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata | null>;
    courseSlug?: string;
}

export function PreCourseAssessmentPreviewer({
    components,
    locale,
    onFileUpload,
    courseSlug,
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
                        disableValidation={true}
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
                        disableValidation={true}
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
                        disableValidation={true}
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
                        disableValidation={true}
                    />
                );

            case FormElementType.UploadFiles:
                return (
                    <UploadFilesFormComponent
                        key={key}
                        elementInstance={formElement}
                        locale={locale}
                        submitValue={(id, element) => {
                            elementProgress.current.set(id, element);
                        }}
                        onFileUpload={onFileUpload}
                        courseSlug={courseSlug}
                        disableValidation={true}
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

