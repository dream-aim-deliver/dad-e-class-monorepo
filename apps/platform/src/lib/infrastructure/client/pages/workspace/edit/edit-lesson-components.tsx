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
import { trpc } from '../../../trpc/cms-client';
import { fileMetadata, shared, viewModels } from '@maany_shr/e-class-models';
import { generateTempId } from './utils/generate-temp-id';
import { useListCoachingOfferingsPresenter } from '../../../hooks/use-coaching-offerings-presenter';
import type { TUploadLessonComponentFileSuccessResponse, TGetDownloadUrlSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';

interface FileUploadProps {
    lessonId: number;
    componentType: string;
    setFile?: (file: fileMetadata.TFileMetadata | null) => void;
    onProgressUpdate?: (progress: number) => void;
}

const useFileUpload = ({
    lessonId,
    componentType,
    setFile,
    onProgressUpdate,
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

        // Track MD5 calculation progress (0-30% of total)
        const checksum = await calculateMd5(uploadRequest.file, (md5Progress) => {
            onProgressUpdate?.(Math.round(md5Progress * 0.3));
        });

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

        // Type assertion after success check
        const uploadData = uploadResult.data as TUploadLessonComponentFileSuccessResponse['data'];

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Comment out to test without the storage running
        // Track upload progress (30-100% of total)
        await uploadToS3({
            file: uploadRequest.file,
            checksum,
            storageUrl: uploadData.storageUrl,
            objectName: uploadData.file.objectName,
            formFields: uploadData.formFields,
            abortSignal,
            onProgress: (uploadProgress) => {
                onProgressUpdate?.(30 + Math.round(uploadProgress * 0.7));
            },
        });

        const verifyResult = await verifyMutation.mutateAsync({
            fileId: uploadData.file.id,
        });
        if (!verifyResult.success) {
            throw new Error(editLessonTranslations('verifyImageError'));
        }

        const verifyData = verifyResult.data as TGetDownloadUrlSuccessResponse['data'];

        return {
            id: uploadData.file.id,
            name: uploadData.file.name,
            url: verifyData.downloadUrl,
            thumbnailUrl: verifyData.downloadUrl,
            size: uploadData.file.size,
            category: uploadData.file.category,
            status: 'available' as const,
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
    hasMaterials?: boolean;
    courseLanguageCode?: string;
}

function RichTextComponent({
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
    validationError,
    hasMaterials,
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
            onIncludeInMaterialsChange={
                hasMaterials ? onIncludeInMaterialsChange : undefined
            }
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
    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const editLessonT = useTranslations('pages.editLesson');

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
        setUploadProgress(undefined);
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'video',
            setFile,
            onProgressUpdate: setUploadProgress,
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
        // Set initial progress when starting upload
        setUploadProgress(0);
        const result = (await handleFileChange(
            fileRequest,
            abortSignal,
        )) as fileMetadata.TFileMetadataVideo;
        // Clear progress when done
        setUploadProgress(undefined);
        return result;
    };

    return (
        <div className="flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <VideoDesignerComponent
                elementInstance={elementInstance as VideoElement}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                maxSize={5120} // 5 GB
                onVideoUpload={onVideoUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
                validationError={validationError}
                uploadProgress={uploadProgress}
            />
            {uploadError && (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={editLessonT('error.title')}
                    description={uploadError}
                />
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
    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const editLessonT = useTranslations('pages.editLesson');

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
        setUploadProgress(undefined);
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'image',
            setFile,
            onProgressUpdate: setUploadProgress,
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
        // Set initial progress when starting upload
        setUploadProgress(0);
        const result = (await handleFileChange(
            fileRequest,
            abortSignal,
        )) as fileMetadata.TFileMetadataImage;
        // Clear progress when done
        setUploadProgress(undefined);
        return result;
    };

    return (
        <div className="flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <ImageDesignerComponent
                elementInstance={elementInstance as ImageElement}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                maxSize={20} // 20 MB
                onImageUpload={onImageUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
                validationError={validationError}
                uploadProgress={uploadProgress}
            />
            {uploadError && (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={editLessonT('error.title')}
                    description={uploadError}
                />
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
    const editLessonT = useTranslations('pages.editLesson');

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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'image',
            setFile,
            onProgressUpdate: setUploadProgress,
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
        <div className="flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
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
                maxSize={20} // 20 MB
                validationError={validationError}
                uploadProgress={uploadProgress}
            />
            {uploadError && (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={editLessonT('error.title')}
                    description={uploadError}
                />
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
    const editLessonT = useTranslations('pages.editLesson');

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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'downloadFiles',
            setFile,
            onProgressUpdate: setUploadProgress,
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
                maxSize={50} // 50 MB
                validationError={validationError}
                uploadProgress={uploadProgress}
            />
            {uploadError && (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={editLessonT('error.title')}
                    description={uploadError}
                />
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
                id: '0',
                title: '',
                options: [],
            },
            {
                id: '1',
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
                id: '0',
                imageFile: null,
                description: '',
                correct: false,
            },
            {
                id: '1',
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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'quizTypeOne',
            setFile,
            onProgressUpdate: setUploadProgress,
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
            uploadProgress={uploadProgress}
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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'quizTypeTwo',
            setFile,
            onProgressUpdate: setUploadProgress,
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
            uploadProgress={uploadProgress}
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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);

    const handleUploadComplete = (
        file: fileMetadata.TFileMetadata,
        index: number,
    ) => {
        setFile(file, index);
    };

    const { uploadError, handleFileChange } = useFileUpload({
        lessonId,
        componentType: 'quizTypeThree',
        onProgressUpdate: setUploadProgress,
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
            uploadProgress={uploadProgress}
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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const { uploadError, handleFileChange } = useFileUpload({
        lessonId,
        componentType: 'quizTypeFour',
        onProgressUpdate: setUploadProgress,
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
            uploadProgress={uploadProgress}
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

    const onAsPartOfMaterialsOnlyChange = (value: boolean) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) => {
                if (component.type !== CourseElementType.Links) {
                    return component;
                }
                if (component.id !== elementInstance.id) {
                    return component;
                }
                // When enabling asPartOfMaterialsOnly, also enable includeInMaterials
                if (value) {
                    return { ...component, asPartOfMaterialsOnly: value, includeInMaterials: true };
                }
                return { ...component, asPartOfMaterialsOnly: value };
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
            onAsPartOfMaterialsOnlyChange={onAsPartOfMaterialsOnlyChange}
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
    courseLanguageCode,
}: LessonComponentProps) {
    const editLessonT = useTranslations('pages.editLesson');
    const queryInput = courseLanguageCode ? { languageCode: courseLanguageCode } : {};
    console.log('[DEBUG CoachingSession] courseLanguageCode prop:', courseLanguageCode, '| query input:', JSON.stringify(queryInput));
    const [coachingOfferingsResponse] =
        trpc.listCoachingOfferings.useSuspenseQuery(queryInput);
    console.log('[DEBUG CoachingSession] response:', JSON.stringify(coachingOfferingsResponse).slice(0, 500));
    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] =
        useState<viewModels.TCoachingOfferingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListCoachingOfferingsPresenter(
        setCoachingOfferingsViewModel,
    );

    // @ts-ignore
    presenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);

    if (!coachingOfferingsViewModel) {
        return <DefaultLoading locale={locale} />;
    }
    if (coachingOfferingsViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={editLessonT('error.title')}
                description={editLessonT('error.description')}
            />
        );
    }

    // Find matching offering by name+duration (backend doesn't return coachingOfferingId)
    const coachingSession = (elementInstance as CoachingSessionElement).coachingSession;
    const matchingOffering = coachingSession
        ? coachingOfferingsViewModel.data.offerings.find(
              (o) => o.name === coachingSession.name && o.duration === coachingSession.duration
          )
        : undefined;

    // Create element with resolved ID (or undefined coachingSession if no match - allows editing)
    const resolvedElement: CoachingSessionElement = {
        ...(elementInstance as CoachingSessionElement),
        coachingSession: matchingOffering
            ? { id: matchingOffering.id as number, name: matchingOffering.name, duration: matchingOffering.duration }
            : undefined,
    };

    return (
        <CoachingSessionDesignerComponent
            key={elementInstance.id}
            elementInstance={resolvedElement}
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
                if (component.type !== CourseElementType.Assignment) {
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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const { handleFileChange: handleResourceFileChange } = useFileUpload({
        lessonId,
        componentType: 'assignmentResource',
        onProgressUpdate: setUploadProgress,
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
            uploadProgress={uploadProgress}
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
    clearValidationError: (componentId: string) => void;
    hasMaterials?: boolean;
    courseLanguageCode?: string;
}

export default function EditLessonComponents({
    lessonId,
    components,
    setComponents,
    courseVersion,
    setCourseVersion,
    validationErrors,
    clearValidationError,
    hasMaterials = true,
    courseLanguageCode,
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
            {components.map((component, index) => {
                const Component = typeToRendererMap[component.type];
                if (!Component) return null;

                const setComponentsWithClear: typeof setComponents = (updater) => {
                    setComponents(updater);
                    clearValidationError(component.id);
                };

                return (
                    <Component
                        lessonId={lessonId}
                        key={component.id}
                        elementInstance={component}
                        locale={locale}
                        setComponents={setComponentsWithClear}
                        onUpClick={onUpClick}
                        onDownClick={onDownClick}
                        onDeleteClick={onDeleteClick}
                        validationError={validationErrors.get(component.id)}
                        hasMaterials={hasMaterials}
                        courseLanguageCode={courseLanguageCode}
                    />
                );
            })}
        </div>
    );
}
