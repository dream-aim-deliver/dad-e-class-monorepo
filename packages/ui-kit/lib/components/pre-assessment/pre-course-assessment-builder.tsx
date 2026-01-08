'use client';

import React from 'react';
import { FormElementType, OneOutOfThreeData } from '../pre-assessment/types';
import { LessonElement } from '../lesson/types';
import {
    HeadingElement,
    MultiCheckElement,
    OneOutOfThreeElement,
    RichTextElement,
    SingleChoiceElement,
    TextInputElement,
    PreAssessmentUploadFilesElement 
} from '../lesson-components/types';
import { DesignerComponent as RichTextDesignerComponent } from '../lesson-components/rich-text';
import { DesignerComponent as HeadingDesignerComponent } from '../lesson-components/heading-lesson';
import { DesignerComponent as TextInputDesignerComponent } from '../lesson-components/text-input';
import { DesignerComponent as SingleChoiceDesignerComponent } from '../lesson-components/single-choice';
import { DesignerComponent as MultiCheckDesignerComponent } from '../lesson-components/multi-check';
import { DesignerComponent as OneOutOfThreeDesignerComponent } from '../lesson-components/one-out-of-three';
import { DesignerComponent as UploadFilesDesignerComponent } from '../lesson-components/upload-files';
import { ComponentCard } from '../course-builder/component-card';
import { SubsectionHeading } from '../text';
import { IconRichText } from '../icons/icon-rich-text';
import { IconHeading } from '../icons/icon-heading';
import { IconTextInput } from '../icons/icon-text-input';
import { IconSingleChoice } from '../icons/icon-single-choice';
import { IconMultiChoice } from '../icons/icon-multi-choice';
import { IconOneOutOfThree } from '../icons/icon-one-out-of-three';
import { IconCloudUpload } from '../icons/icon-cloud-upload';
import { optionsType } from '../single-choice';
import { isLocalAware } from '@maany_shr/e-class-translations';

export interface PreCourseAssessmentBuilderProps extends isLocalAware {
    components: LessonElement[];
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    validationErrors: Map<string, string | undefined>;
    generateTempId: () => string;
    translations: {
        richText: string;
        heading: string;
        textInput: string;
        singleChoice: string;
        checklist: string;
        oneOutOfThree: string;
        uploadFiles: string;
        components: string;
    };
}

export function PreCourseAssessmentBuilder({
    components,
    setComponents,
    validationErrors,
    locale,
    generateTempId,
    translations,
}: PreCourseAssessmentBuilderProps) {
    const onUpClick = (id: string) => {
        setComponents((prev) => {
            const index = prev.findIndex((comp) => comp.id === id);
            if (index > 0) {
                const updatedComponents = [...prev];
                const [movedComponent] = updatedComponents.splice(index, 1);
                updatedComponents.splice(index - 1, 0, movedComponent);
                return updatedComponents;
            }
            return prev;
        });
    };

    const onDownClick = (id: string) => {
        setComponents((prev) => {
            const index = prev.findIndex((comp) => comp.id === id);
            if (index < prev.length - 1) {
                const updatedComponents = [...prev];
                const [movedComponent] = updatedComponents.splice(index, 1);
                updatedComponents.splice(index + 1, 0, movedComponent);
                return updatedComponents;
            }
            return prev;
        });
    };

    const onDeleteClick = (id: string) => {
        setComponents((prev) => prev.filter((comp) => comp.id !== id));
    };

    const componentButtons = [
        {
            icon: <IconRichText />,
            label: translations.richText,
            onClick: () => {
                const newComponent: RichTextElement = {
                    id: generateTempId(),
                    type: FormElementType.RichText,
                    content: '',
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconHeading size="6" />,
            label: translations.heading,
            onClick: () => {
                const newComponent: HeadingElement = {
                    id: generateTempId(),
                    type: FormElementType.HeadingText,
                    heading: '',
                    headingType: 'h1',
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconTextInput />,
            label: translations.textInput,
            onClick: () => {
                const newComponent: TextInputElement = {
                    id: generateTempId(),
                    type: FormElementType.TextInput,
                    helperText: '',
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconSingleChoice />,
            label: translations.singleChoice,
            onClick: () => {
                const newComponent: SingleChoiceElement = {
                    id: generateTempId(),
                    type: FormElementType.SingleChoice,
                    title: '',
                    options: [],
                    required: false,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconMultiChoice />,
            label: translations.checklist,
            onClick: () => {
                const newComponent: MultiCheckElement = {
                    id: generateTempId(),
                    type: FormElementType.MultiCheck,
                    title: '',
                    options: [],
                    required: false,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconOneOutOfThree />,
            label: translations.oneOutOfThree,
            onClick: () => {
                const newComponent: OneOutOfThreeElement = {
                    id: generateTempId(),
                    type: FormElementType.OneOutOfThree,
                    data: {
                        tableTitle: '',
                        rows: [],
                        columns: [],
                    },
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
        {
            icon: <IconCloudUpload />,
            label: translations.uploadFiles,
            onClick: () => {
                const newComponent: PreAssessmentUploadFilesElement = {
                    id: generateTempId(),
                    type: FormElementType.UploadFiles,
                    description: '',
                    files: null,
                };
                setComponents((prev) => [...prev, newComponent]);
            },
        },
    ];

    const renderComponent = (component: LessonElement) => {
        const validationError = validationErrors.get(component.id);
        const commonProps = {
            locale,
            onUpClick: () => onUpClick(component.id),
            onDownClick: () => onDownClick(component.id),
            onDeleteClick: () => onDeleteClick(component.id),
            validationError,
            isCourseBuilder: true,
        };

        switch (component.type) {
            case FormElementType.RichText: {
                const richText = component as RichTextElement;
                return (
                    <RichTextDesignerComponent
                        key={component.id}
                        elementInstance={richText}
                        onContentChange={(value: string) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, content: value }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            case FormElementType.HeadingText: {
                const heading = component as HeadingElement;
                return (
                    <HeadingDesignerComponent
                        key={component.id}
                        elementInstance={heading}
                        onChange={(value: { heading: string; type: string }) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? {
                                              ...comp,
                                              heading: value.heading,
                                              headingType: value.type,
                                          }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            case FormElementType.TextInput: {
                const textInput = component as TextInputElement;
                return (
                    <TextInputDesignerComponent
                        key={component.id}
                        elementInstance={textInput}
                        onHelperTextChange={(helperText: string) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, helperText }
                                        : comp,
                                ),
                            );
                        }}
                        onRequiredChange={(isRequired: boolean) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, required: isRequired }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            case FormElementType.SingleChoice: {
                const singleChoice = component as SingleChoiceElement;
                return (
                    <SingleChoiceDesignerComponent
                        key={component.id}
                        elementInstance={singleChoice}
                        onChange={(title: string, options: optionsType[]) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, title, options } as SingleChoiceElement
                                        : comp,
                                ),
                            );
                        }}
                        onRequiredChange={(isRequired: boolean) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, required: isRequired }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            case FormElementType.MultiCheck: {
                const multiCheck = component as MultiCheckElement;
                return (
                    <MultiCheckDesignerComponent
                        key={component.id}
                        elementInstance={multiCheck}
                        onChange={(title: string, options: optionsType[]) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, title, options } as MultiCheckElement
                                        : comp,
                                ),
                            );
                        }}
                        onRequiredChange={(isRequired: boolean) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, required: isRequired }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            case FormElementType.OneOutOfThree: {
                const oneOutOfThree = component as OneOutOfThreeElement;
                return (
                    <OneOutOfThreeDesignerComponent
                        key={component.id}
                        elementInstance={oneOutOfThree}
                        onChange={(updatedData: OneOutOfThreeData) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, data: updatedData }
                                        : comp,
                                ),
                            );
                        }}
                        onRequiredChange={(isRequired: boolean) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, required: isRequired }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            case FormElementType.UploadFiles: {
                const uploadFiles = component as PreAssessmentUploadFilesElement;
                return (
                    <UploadFilesDesignerComponent
                        key={component.id}
                        elementInstance={uploadFiles}
                        onDescriptionChange={(description: string) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, description }
                                        : comp,
                                ),
                            );
                        }}
                        onRequiredChange={(isRequired: boolean) => {
                            setComponents((prev) =>
                                prev.map((comp) =>
                                    comp.id === component.id
                                        ? { ...comp, required: isRequired }
                                        : comp,
                                ),
                            );
                        }}
                        {...commonProps}
                    />
                );
            }

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4">
            <div className="text-text-primary flex flex-col overflow-auto bg-card-fill border border-card-stroke rounded-medium gap-2 mb-4 p-6 h-fit">
                <SubsectionHeading text={translations.components} />
                {componentButtons.map((button, index) => (
                    <ComponentCard
                        key={index}
                        name={button.label}
                        icon={button.icon}
                        onClick={button.onClick}
                    />
                ))}
            </div>
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="flex flex-col gap-2">
                    {components.map((component) => renderComponent(component))}
                </div>
            </div>
        </div>
    );
}

