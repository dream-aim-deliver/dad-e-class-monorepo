import React, { useState } from 'react';
import {
    AbortError,
    calculateMd5,
    CourseElement,
    CourseElementType,
    DefaultError,
    downloadFile,
    DownloadFilesDesignerComponent,
    FormElementType,
    HeadingDesignerComponent,
    HeadingElement,
    ImageDesignerComponent,
    ImageElement,
    ImageGalleryDesignerComponent,
    LessonElement,
    MultiCheckDesignerComponent,
    OneOutOfThreeData,
    OneOutOfThreeDesignerComponent,
    QuizDesignerComponent,
    RichTextDesignerComponent,
    RichTextElement,
    SingleChoiceDesignerComponent,
    SingleChoiceElement,
    TextInputDesignerComponent,
    UploadFilesDesignerComponent,
    VideoDesignerComponent,
    VideoElement,
    LinksDesignerComponent,
    LinksElement,
    CoachingSessionDesignerComponent,
    CoachingSessionElement,
    DefaultLoading,
    AssignmentDesignerComponent,
    AssignmentElement,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/client';
import { fileMetadata, shared, viewModels } from '@maany_shr/e-class-models';
import { generateTempId } from './utils/generate-temp-id';
import { useListCoachingOfferingsPresenter } from '../../../hooks/use-coaching-offerings-presenter';

interface FileUploadProps {
    lessonId: number;
    componentType: string;
    setFile?: (file: fileMetadata.TFileMetadata | null) => void;
}

const useFileUpload = ({
    lessonId,
    componentType,
    setFile,
}: FileUploadProps) => {
    const editLessonTranslations = useTranslations(
        'components.useCourseImageUpload',
    );

    const uploadMutation = trpc.uploadLessonComponentFile.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [uploadError, setUploadError] = useState<string | undefined>(
        undefined,
    );

    const uploadImage = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        const checksum = await calculateMd5(uploadRequest.file);

        // For mutations, we aren't able to abort them midway.
        // Hence, we check for abort signal before each step.
        const uploadResult = await uploadMutation.mutateAsync({
            lessonId,
            componentType,
            name: uploadRequest.name,
            checksum,
            mimeType: uploadRequest.file.type,
            size: uploadRequest.file.size,
        });
        if (!uploadResult.success) {
            throw new Error(editLessonTranslations('uploadCredentialsError'));
        }

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Comment out to test without the storage running
        await uploadToS3({
            file: uploadRequest.file,
            checksum,
            storageUrl: uploadResult.data.storageUrl,
            objectName: uploadResult.data.file.objectName,
            formFields: uploadResult.data.formFields,
            abortSignal,
        });

        const verifyResult = await verifyMutation.mutateAsync({
            fileId: uploadResult.data.file.id,
        });
        if (!verifyResult.success) {
            throw new Error(editLessonTranslations('verifyImageError'));
        }

        return {
            id: uploadResult.data.file.id,
            name: uploadResult.data.file.name,
            url: verifyResult.data.downloadUrl,
            thumbnailUrl: verifyResult.data.downloadUrl,
            size: uploadResult.data.file.size,
            category: uploadResult.data.file.category,
            status: 'available',
        } as fileMetadata.TFileMetadata;
    };

    const handleFileChange = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        setUploadError(undefined);
        try {
            return await uploadImage(uploadRequest, abortSignal);
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn(editLessonTranslations('uploadAbortError'));
            } else {
                console.error('File upload failed:', error);
                setUploadError(editLessonTranslations('uploadFailedError'));
            }
            throw error;
        }
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setFile?.(file);
    };

    return {
        uploadError,
        handleFileChange,
        handleUploadComplete,
    };
};

interface LessonComponentProps {
    lessonId: number;
    elementInstance: LessonElement;
    locale: TLocale;
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    onUpClick: (id: string) => void;
    onDownClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
    validationError?: string | undefined;
}

function RichTextComponent({
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const updateComponent = (
        comp: LessonElement,
        updated: Partial<LessonElement>,
    ): LessonElement => {
        if (comp.type !== FormElementType.RichText) return comp;
        if (updated.type !== FormElementType.RichText) return comp;
        if (comp.id === elementInstance.id) {
            return { ...comp, ...updated };
        }
        return comp;
    };

    const onContentChange = (value: string) => {
        setComponents((prev) =>
            prev.map((comp) =>
                updateComponent(comp, {
                    type: FormElementType.RichText,
                    content: value,
                }),
            ),
        );
    };

    const onIncludeInMaterialsChange = (value: boolean) => {
        setComponents((prev) =>
            prev.map((comp) =>
                updateComponent(comp, {
                    type: FormElementType.RichText,
                    includeInMaterials: value,
                }),
            ),
        );
    };

    return (
        <RichTextDesignerComponent
            elementInstance={elementInstance as RichTextElement}
            locale={locale}
            onIncludeInMaterialsChange={onIncludeInMaterialsChange}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onContentChange={onContentChange}
            validationError={validationError}
            isCourseBuilder={true}
        />
    );
}

function HeadingComponent({
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const updateComponent = (
        comp: LessonElement,
        updated: Partial<LessonElement>,
    ): LessonElement => {
        if (comp.type !== FormElementType.HeadingText) return comp;
        if (updated.type !== FormElementType.HeadingText) return comp;
        if (comp.id === elementInstance.id) {
            return { ...comp, ...updated };
        }
        return comp;
    };

    const handleChange = (value: { heading: string; type: string }) => {
        setComponents((prev) =>
            prev.map((comp) =>
                updateComponent(comp, {
                    type: FormElementType.HeadingText,
                    heading: value.heading,
                    headingType: value.type,
                }),
            ),
        );
    };

    return (
        <HeadingDesignerComponent
            elementInstance={elementInstance as HeadingElement}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={handleChange}
            validationError={validationError}
            isCourseBuilder={true}
        />
    );
}

function VideoComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const updateComponent = (
        comp: LessonElement,
        updated: Partial<LessonElement>,
    ): LessonElement => {
        if (comp.type !== CourseElementType.VideoFile) return comp;
        if (updated.type !== CourseElementType.VideoFile) return comp;
        if (comp.id === elementInstance.id) {
            return { ...comp, ...updated };
        }
        return comp;
    };

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prev) =>
            prev.map((comp) =>
                updateComponent(comp, {
                    type: CourseElementType.VideoFile,
                    file: file as fileMetadata.TFileMetadataVideo,
                }),
            ),
        );
    };

    const handleDelete = () => {
        setFile(null);
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'video',
            setFile,
        });

    if (elementInstance.type !== CourseElementType.VideoFile) return null;

    const handleDownload = () => {
        if (elementInstance.file) {
            downloadFile(elementInstance.file.url, elementInstance.file.name);
        }
    };

    const onVideoUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadataVideo> => {
        return (await handleFileChange(
            fileRequest,
            abortSignal,
        )) as fileMetadata.TFileMetadataVideo;
    };

    return (
        <div className="flex flex-col gap-4 p-4 bg-card-fill border border-base-neutral-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <VideoDesignerComponent
                elementInstance={elementInstance as VideoElement}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                maxSize={2000000} // 2TB
                onVideoUpload={onVideoUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
                validationError={validationError}
            />
            {uploadError && (
                <DefaultError locale={locale} description={uploadError} />
            )}
        </div>
    );
}

function ImageComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const updateComponent = (
        comp: LessonElement,
        updated: Partial<LessonElement>,
    ): LessonElement => {
        if (comp.type !== CourseElementType.ImageFile) return comp;
        if (updated.type !== CourseElementType.ImageFile) return comp;
        if (comp.id === elementInstance.id) {
            return { ...comp, ...updated };
        }
        return comp;
    };

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prev) =>
            prev.map((comp) =>
                updateComponent(comp, {
                    type: CourseElementType.ImageFile,
                    file: file as fileMetadata.TFileMetadataImage,
                }),
            ),
        );
    };

    const handleDelete = () => {
        setFile(null);
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'image',
            setFile,
        });

    if (elementInstance.type !== CourseElementType.ImageFile) return null;

    const handleDownload = () => {
        if (elementInstance.file) {
            downloadFile(elementInstance.file.url, elementInstance.file.name);
        }
    };

    const onImageUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadataImage> => {
        return (await handleFileChange(
            fileRequest,
            abortSignal,
        )) as fileMetadata.TFileMetadataImage;
    };

    return (
        <div className="flex flex-col w-full gap-4 p-10 bg-card-fill border border-base-neutral-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <ImageDesignerComponent
                elementInstance={elementInstance as ImageElement}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                maxSize={50} // 50MB
                onImageUpload={onImageUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
                validationError={validationError}
            />
            {uploadError && (
                <DefaultError locale={locale} description={uploadError} />
            )}
        </div>
    );
}

function ImageGalleryComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        if (elementInstance.type !== CourseElementType.ImageGallery) return;
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.ImageGallery)
                    return component;
                if (component.id !== elementInstance.id) return component;
                const existingImages = component.images
                    ? [...component.images]
                    : [];

                const updatedImages = [
                    ...existingImages,
                    file as fileMetadata.TFileMetadataImage,
                ];
                return { ...component, images: updatedImages };
            }),
        );
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'image',
            setFile,
        });

    if (elementInstance.type !== CourseElementType.ImageGallery) return null;

    const handleDelete = (imageId: string) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.ImageGallery)
                    return component;
                if (component.id !== elementInstance.id) return component;
                const filteredImages =
                    component.images?.filter(
                        (image: any) => image.id !== imageId,
                    ) ?? null;
                return { ...component, images: filteredImages };
            }),
        );
    };

    const handleDownload = (id: string) => {
        const file = elementInstance.images?.find((img) => img.id === id);
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    const onImageUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadataImage> => {
        return (await handleFileChange(
            fileRequest,
            abortSignal,
        )) as fileMetadata.TFileMetadataImage;
    };

    return (
        <div className="flex flex-col w-full gap-4 p-4 bg-card-fill border border-base-neutral-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <ImageGalleryDesignerComponent
                elementInstance={elementInstance}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                onImageUpload={onImageUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
                maxSize={50} // 50MB
                validationError={validationError}
            />
            {uploadError && (
                <DefaultError locale={locale} description={uploadError} />
            )}
        </div>
    );
}

function DownloadFilesComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        if (elementInstance.type !== CourseElementType.DownloadFiles) return;
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.DownloadFiles)
                    return component;
                if (component.id !== elementInstance.id) return component;
                const existingFiles = component.files
                    ? [...component.files]
                    : [];
                const updatedFiles = [
                    ...existingFiles,
                    file as fileMetadata.TFileMetadata,
                ];
                return { ...component, files: updatedFiles };
            }),
        );
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'downloadFiles',
            setFile,
        });

    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;

    const handleDownload = (id: string) => {
        const file = elementInstance.files?.find((file) => file.id === id);
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    const handleDelete = (fileId: string) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.DownloadFiles)
                    return component;
                if (component.id !== elementInstance.id) return component;
                const filteredFiles =
                    component.files?.filter(
                        (file: any) => file.id !== fileId,
                    ) ?? null;

                return { ...component, files: filteredFiles };
            }),
        );
    };

    return (
        <div className="flex flex-col gap-2">
            <DownloadFilesDesignerComponent
                elementInstance={elementInstance}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                onFilesUpload={handleFileChange}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
                maxSize={100} // 100MB
                validationError={validationError}
            />
            {uploadError && (
                <DefaultError locale={locale} description={uploadError} />
            )}
        </div>
    );
}

function TextInputComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.TextInput) return null;

    const onHelperTextChange = (helperText: string) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id ? { ...comp, helperText } : comp,
            ),
        );
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id
                    ? { ...comp, required: isRequired }
                    : comp,
            ),
        );
    };

    return (
        <TextInputDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onHelperTextChange={onHelperTextChange}
            onRequiredChange={onRequiredChange}
            validationError={validationError}
            isCourseBuilder={true}
        />
    );
}

function UploadFilesComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    if (elementInstance.type !== CourseElementType.UploadFiles) return null;

    const onDescriptionChange = (description: string) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                const isTargetComponent = component.id === elementInstance.id;

                if (isTargetComponent) {
                    return { ...component, description };
                }

                return component;
            });
        });
    };

    return (
        <UploadFilesDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onDescriptionChange}
            validationError={validationError}
        />
    );
}

function SingleChoiceComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.SingleChoice) return null;

    const onChange = (
        title: string,
        options: SingleChoiceElement['options'],
    ) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                if (component.type !== FormElementType.SingleChoice) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, title, options };
            });
        });
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                if (component.type !== FormElementType.SingleChoice) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, required: isRequired };
            });
        });
    };

    return (
        <SingleChoiceDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onRequiredChange={onRequiredChange}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            validationError={validationError}
            isCourseBuilder={true}
        />
    );
}

function MultiCheckComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.MultiCheck) return null;

    const onChange = (
        title: string,
        options: SingleChoiceElement['options'],
    ) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                if (component.type !== FormElementType.MultiCheck) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, title, options };
            });
        });
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                if (component.type !== FormElementType.MultiCheck) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, required: isRequired };
            });
        });
    };

    return (
        <MultiCheckDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onRequiredChange={onRequiredChange}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            validationError={validationError}
            isCourseBuilder={true}
        />
    );
}

function OneOutOfThreeComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;

    const onChange = (updatedData: OneOutOfThreeData) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                if (component.type !== FormElementType.OneOutOfThree) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, data: updatedData };
            });
        });
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prevComponents) => {
            return prevComponents.map((component) => {
                if (component.type !== FormElementType.OneOutOfThree) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, isRequired: isRequired };
            });
        });
    };

    return (
        <OneOutOfThreeDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onRequiredChange={onRequiredChange}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            validationError={validationError}
            isCourseBuilder={true}
        />
    );
}

const quizTypeInitializers: Record<string, () => LessonElement> = {
    quizTypeOne: () => ({
        id: generateTempId(),
        type: CourseElementType.QuizTypeOne,
        title: '',
        description: '',
        imageFile: null,
        options: [],
    }),
    quizTypeTwo: () => ({
        id: generateTempId(),
        type: CourseElementType.QuizTypeTwo,
        title: '',
        description: '',
        imageFile: null,
        groups: [
            {
                id: 0,
                title: '',
                options: [],
            },
            {
                id: 1,
                title: '',
                options: [],
            },
        ],
    }),
    quizTypeThree: () => ({
        id: generateTempId(),
        type: CourseElementType.QuizTypeThree,
        title: '',
        description: '',
        options: [
            {
                id: 0,
                imageFile: null,
                description: '',
                correct: false,
            },
            {
                id: 1,
                imageFile: null,
                description: '',
                correct: false,
            },
        ],
    }),
    quizTypeFour: () => ({
        id: generateTempId(),
        type: CourseElementType.QuizTypeFour,
        title: '',
        description: '',
        images: [],
        labels: [],
    }),
};

const onTypeChange = (
    type: string,
    elementInstance: LessonElement,
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>,
) => {
    if (elementInstance.type === type) return;
    const newComponent = quizTypeInitializers[type]();
    setComponents((prev) => [
        ...prev.filter((comp) => comp.id !== elementInstance.id),
        newComponent,
    ]);
};

function QuizTypeOneComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const onChange = (updated: Partial<CourseElement>) => {
        if (updated.type !== CourseElementType.QuizTypeOne) return;

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeOne) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, ...updated };
            }),
        );
    };

    const onFileDelete = () => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeOne) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, imageFile: null };
            }),
        );
    };

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeOne) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return {
                    ...component,
                    imageFile: file as fileMetadata.TFileMetadataImage,
                };
            }),
        );
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'quizTypeOne',
            setFile,
        });

    if (elementInstance.type !== CourseElementType.QuizTypeOne) return null;

    const handleDownload = () => {
        const file = elementInstance.imageFile;
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <QuizDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onTypeChange={(type) =>
                onTypeChange(type, elementInstance, setComponents)
            }
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            onFileChange={handleFileChange}
            onFileDelete={onFileDelete}
            onFileDownload={handleDownload}
            onUploadComplete={handleUploadComplete}
            uploadError={uploadError ?? null}
            validationError={validationError}
        />
    );
}

function QuizTypeTwoComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const onChange = (updated: Partial<CourseElement>) => {
        if (updated.type !== CourseElementType.QuizTypeTwo) return;

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeTwo) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, ...updated };
            }),
        );
    };

    const onFileDelete = () => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeTwo) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, imageFile: null };
            }),
        );
    };

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeTwo) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return {
                    ...component,
                    imageFile: file as fileMetadata.TFileMetadataImage,
                };
            }),
        );
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'quizTypeTwo',
            setFile,
        });

    if (elementInstance.type !== CourseElementType.QuizTypeTwo) return null;

    const handleDownload = () => {
        const file = elementInstance.imageFile;
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <QuizDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onTypeChange={(type) =>
                onTypeChange(type, elementInstance, setComponents)
            }
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            onFileChange={handleFileChange}
            onFileDelete={onFileDelete}
            onFileDownload={handleDownload}
            onUploadComplete={handleUploadComplete}
            uploadError={uploadError ?? null}
            validationError={validationError}
        />
    );
}

function QuizTypeThreeComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const onChange = (updated: Partial<CourseElement>) => {
        if (updated.type !== CourseElementType.QuizTypeThree) return;

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeThree) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, ...updated };
            }),
        );
    };

    const onFileDelete = (_: string, index: number) => {
        const updateOption = (option: any, idx: number) => {
            if (idx !== index) {
                return option;
            }
            return { ...option, imageFile: null };
        };

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeThree) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return {
                    ...component,
                    options: component.options?.map(updateOption),
                };
            }),
        );
    };

    const setFile = (
        file: fileMetadata.TFileMetadata | null,
        index: number,
    ) => {
        const updateOption = (option: any, idx: number) => {
            if (idx !== index) {
                return option;
            }
            return {
                ...option,
                imageFile: file as fileMetadata.TFileMetadataImage,
            };
        };

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeThree) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return {
                    ...component,
                    options: component.options?.map(updateOption),
                };
            }),
        );
    };

    const handleUploadComplete = (
        file: fileMetadata.TFileMetadata,
        index: number,
    ) => {
        setFile(file, index);
    };

    const { uploadError, handleFileChange } = useFileUpload({
        lessonId,
        componentType: 'quizTypeThree',
    });

    if (elementInstance.type !== CourseElementType.QuizTypeThree) return null;

    const handleDownload = (id: string) => {
        const file = elementInstance.options?.find(
            (option) => option.imageFile?.id === id,
        )?.imageFile;
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <QuizDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onTypeChange={(type) =>
                onTypeChange(type, elementInstance, setComponents)
            }
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            onFileChange={handleFileChange}
            onFileDelete={onFileDelete}
            onFileDownload={handleDownload}
            onUploadComplete={handleUploadComplete}
            uploadError={uploadError ?? null}
            validationError={validationError}
        />
    );
}

function QuizTypeFourComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const onChange = (updated: Partial<CourseElement>) => {
        if (updated.type !== CourseElementType.QuizTypeFour) return;

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeFour) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, ...updated };
            }),
        );
    };

    const onFileDelete = (fileId: string, index: number) => {
        const updateImage = (image: any, idx: number) => {
            if (idx !== index) {
                return image;
            }
            return { ...image, imageFile: null };
        };

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeFour) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return {
                    ...component,
                    images: component.images?.map(updateImage),
                };
            }),
        );
    };

    const setFile = (
        file: fileMetadata.TFileMetadata | null,
        index: number,
    ) => {
        const updateImage = (image: any, idx: number) => {
            if (idx !== index) {
                return image;
            }
            return {
                ...image,
                imageFile: file as fileMetadata.TFileMetadataImage,
            };
        };

        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.QuizTypeFour) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return {
                    ...component,
                    images: component.images?.map(updateImage),
                };
            }),
        );
    };

    const handleUploadComplete = (
        file: fileMetadata.TFileMetadata,
        index: number,
    ) => {
        setFile(file, index);
    };

    const { uploadError, handleFileChange } = useFileUpload({
        lessonId,
        componentType: 'quizTypeFour',
    });

    if (elementInstance.type !== CourseElementType.QuizTypeFour) return null;

    const handleDownload = (id: string) => {
        const file = elementInstance.images?.find(
            (image) => image.imageFile?.id === id,
        )?.imageFile;
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <QuizDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onTypeChange={(type) =>
                onTypeChange(type, elementInstance, setComponents)
            }
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onChange}
            onFileChange={handleFileChange}
            onFileDelete={onFileDelete}
            onFileDownload={handleDownload}
            onUploadComplete={handleUploadComplete}
            uploadError={uploadError ?? null}
            validationError={validationError}
        />
    );
}

const getExampleLink = () => {
    return {
        title: 'New Link',
        url: 'https://example.com',
    };
};

function LinksComponent({
    lessonId,
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const onLinkEdit = (data: shared.TLink, index: number) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                const updatedLinks = [...component.links];
                updatedLinks[index] = { ...updatedLinks[index], ...data };
                return { ...component, links: updatedLinks };
            }),
        );
    };

    const onAddLink = () => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                const updatedLinks = [...component.links];
                updatedLinks.push(getExampleLink());
                return { ...component, links: updatedLinks };
            }),
        );
    };

    const onLinkDelete = (index: number) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                const updatedLinks = [...component.links];
                updatedLinks.splice(index, 1);
                return { ...component, links: updatedLinks };
            }),
        );
    };

    const onDeleteIcon = (index: number) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                const updatedLinks = [...component.links];
                updatedLinks[index].customIcon = undefined;
                return { ...component, links: updatedLinks };
            }),
        );
    };

    const onImageReady = (file: fileMetadata.TFileMetadata, index: number) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                const updatedLinks = [...component.links];
                updatedLinks[index].customIcon = file;
                return { ...component, links: updatedLinks };
            }),
        );
    };

    const onIncludeInMaterialsChange = (value: boolean) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, includeInMaterials: value };
            }),
        );
    };

    const { uploadError, handleFileChange } = useFileUpload({
        lessonId,
        componentType: 'links',
    });

    // TODO: Integrate upload error with a banner
    return (
        <LinksDesignerComponent
            elementInstance={elementInstance as LinksElement}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onImageChange={handleFileChange}
            onImageReady={onImageReady}
            onLinkDelete={onLinkDelete}
            onLinkEdit={onLinkEdit}
            onDeleteIcon={onDeleteIcon}
            onClickAddLink={onAddLink}
            validationError={validationError}
            onIncludeInMaterialsChange={onIncludeInMaterialsChange}
        />
    );
}

function CoachingSessionComponent({
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const [coachingOfferingsResponse] =
        trpc.listCoachingOfferings.useSuspenseQuery({});
    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] =
        useState<viewModels.TCoachingOfferingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListCoachingOfferingsPresenter(
        setCoachingOfferingsViewModel,
    );
    presenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);

    if (!coachingOfferingsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachingOfferingsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <CoachingSessionDesignerComponent
            key={elementInstance.id}
            elementInstance={elementInstance as CoachingSessionElement}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onSessionChange={(session) => {
                setComponents((prevComponents) =>
                    prevComponents.map((component) => {
                        if (component.id !== elementInstance.id) {
                            return component;
                        }
                        return { ...component, coachingSession: session };
                    }),
                );
            }}
            coachingSessionTypes={coachingOfferingsViewModel.data.offerings.map(
                (offering) => ({
                    id: offering.id as number,
                    name: offering.name,
                    duration: offering.duration,
                }),
            )}
            validationError={validationError}
        />
    );
}

function AssignmentComponent({
    lessonId,
    elementInstance,
    setComponents,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
}: LessonComponentProps) {
    const onChange = (newAssignment: AssignmentElement): void => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                return { ...component, ...newAssignment };
            }),
        );
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata): void => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                if (component.type !== CourseElementType.Assignment) {
                    return component;
                }
                const currentFiles = component.files ?? [];
                return { ...component, files: [...currentFiles, file] };
            }),
        );
    };

    const handleFileDelete = (fileId: string): void => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                if (component.type !== CourseElementType.Assignment) {
                    return component;
                }
                const currentFiles = component.files ?? [];
                return {
                    ...component,
                    files: currentFiles.filter((file) => file.id !== fileId),
                };
            }),
        );
    };

    const handleFileDownload = (id: string): void => {
        if (elementInstance.type !== CourseElementType.Assignment) return;
        const file = elementInstance.files?.find((file) => file.id === id);
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    const handleAddLink = () => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                if (component.type !== CourseElementType.Assignment) {
                    return component;
                }
                const currentLinks = component.links ?? [];
                return {
                    ...component,
                    links: [...currentLinks, getExampleLink()],
                };
            }),
        );
    };

    const handleDeleteLink = (index: number): void => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                if (component.type !== CourseElementType.Assignment) {
                    return component;
                }
                const currentLinks = component.links ?? [];
                return {
                    ...component,
                    links: currentLinks.filter((_, i) => i !== index),
                };
            }),
        );
    };

    const handleEditLink = (link: shared.TLink, index: number): void => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                if (component.type !== CourseElementType.Assignment) {
                    return component;
                }
                const currentLinks = component.links ?? [];
                return {
                    ...component,
                    links: currentLinks.map((l, i) => (i === index ? link : l)),
                };
            }),
        );
    };

    const handleDeleteLinkIcon = (index: number) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.id !== elementInstance.id) {
                    return component;
                }
                if (component.type !== CourseElementType.Assignment) {
                    return component;
                }
                const currentLinks = component.links ?? [];
                return {
                    ...component,
                    links: currentLinks.map((link, i) => {
                        console.log(link, i, index);
                        if (i === index) {
                            return {
                                ...link,
                                icon: null,
                            };
                        }
                        return link;
                    }),
                };
            }),
        );
    };

    const { handleFileChange: handleResourceFileChange } = useFileUpload({
        lessonId,
        componentType: 'assignmentResource',
    });

    const { handleFileChange: handleIconChange } = useFileUpload({
        lessonId,
        componentType: 'links',
    });

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    return (
        <AssignmentDesignerComponent
            key={elementInstance.id}
            elementInstance={elementInstance as AssignmentElement}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            validationError={validationError}
            onChange={onChange}
            onFilesChange={handleResourceFileChange}
            onImageChange={handleIconChange}
            onDeleteIcon={handleDeleteLinkIcon}
            onUploadComplete={handleUploadComplete}
            onFileDelete={handleFileDelete}
            onFileDownload={handleFileDownload}
            onLinkDelete={handleDeleteLink}
            onLinkEdit={(link, index) => {
                handleEditLink(link, index);
                setLinkEditIndex(null);
            }}
            linkEditIndex={linkEditIndex}
            onClickEditLink={(index) => {
                setLinkEditIndex(index);
            }}
            onClickAddLink={handleAddLink}
            onLinkDiscard={() => {
                setLinkEditIndex(null);
            }}
        />
    );
}

const typeToRendererMap: Record<any, React.FC<LessonComponentProps>> = {
    [FormElementType.RichText]: RichTextComponent,
    [FormElementType.HeadingText]: HeadingComponent,
    [CourseElementType.VideoFile]: VideoComponent,
    [CourseElementType.ImageFile]: ImageComponent,
    [CourseElementType.ImageGallery]: ImageGalleryComponent,
    [CourseElementType.DownloadFiles]: DownloadFilesComponent,
    [FormElementType.TextInput]: TextInputComponent,
    [CourseElementType.UploadFiles]: UploadFilesComponent,
    [FormElementType.SingleChoice]: SingleChoiceComponent,
    [FormElementType.MultiCheck]: MultiCheckComponent,
    [FormElementType.OneOutOfThree]: OneOutOfThreeComponent,
    [CourseElementType.QuizTypeOne]: QuizTypeOneComponent,
    [CourseElementType.QuizTypeTwo]: QuizTypeTwoComponent,
    [CourseElementType.QuizTypeThree]: QuizTypeThreeComponent,
    [CourseElementType.QuizTypeFour]: QuizTypeFourComponent,
    [CourseElementType.Links]: LinksComponent,
    [CourseElementType.CoachingSession]: CoachingSessionComponent,
    [CourseElementType.Assignment]: AssignmentComponent,
    // Add other mappings as needed
};

interface EditLessonComponentsProps {
    lessonId: number;
    components: LessonElement[];
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
    validationErrors: Map<string, string | undefined>;
}

export default function EditLessonComponents({
    lessonId,
    components,
    setComponents,
    courseVersion,
    setCourseVersion,
    validationErrors,
}: EditLessonComponentsProps) {
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

    const locale = useLocale() as TLocale;

    return (
        <div className="flex flex-col gap-2">
            {components.map((component) => {
                const Component = typeToRendererMap[component.type];
                if (!Component) return null;
                // TODO: pass isFirst and isLast
                return (
                    <Component
                        lessonId={lessonId}
                        key={component.id}
                        elementInstance={component}
                        locale={locale}
                        setComponents={setComponents}
                        onUpClick={onUpClick}
                        onDownClick={onDownClick}
                        onDeleteClick={onDeleteClick}
                        validationError={validationErrors.get(component.id)}
                    />
                );
            })}
        </div>
    );
}
