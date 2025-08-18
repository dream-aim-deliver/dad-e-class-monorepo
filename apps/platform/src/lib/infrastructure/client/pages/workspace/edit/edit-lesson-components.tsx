import React, { useEffect, useState } from 'react';
import { useLessonComponents } from './hooks/edit-lesson-hooks';
import {
    AbortError,
    calculateMd5,
    CourseElementType,
    DefaultError,
    DefaultLoading,
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
    MultiCheckElement,
    OneOutOfThreeData,
    OneOutOfThreeDesignerComponent,
    RichTextDesignerComponent,
    RichTextElement,
    SingleChoiceDesignerComponent,
    SingleChoiceElement,
    TextInputDesignerComponent,
    UploadFilesDesignerComponent,
    uploadToS3,
    VideoDesignerComponent,
    VideoElement,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../../trpc/client';
import { fileMetadata } from '@maany_shr/e-class-models';
import { transformLessonComponents } from '../../../utils/transform-lesson-components';

interface FileUploadProps {
    lessonId: number;
    componentType: string;
    setFile: (file: fileMetadata.TFileMetadata | null) => void;
}

const useFileUpload = ({
    lessonId,
    componentType,
    setFile,
}: FileUploadProps) => {
    const uploadMutation = trpc.uploadLessonComponentFile.useMutation();
    const verifyMutation = trpc.verifyFile.useMutation();

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
            throw new Error('Failed to get upload credentials');
        }

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Comment out to test without the storage running
        // await uploadToS3({
        //     file: uploadRequest.file,
        //     checksum,
        //     storageUrl: uploadResult.data.storageUrl,
        //     objectName: uploadResult.data.file.objectName,
        //     formFields: uploadResult.data.formFields,
        //     abortSignal,
        // });

        const verifyResult = await verifyMutation.mutateAsync({
            fileId: uploadResult.data.file.id,
        });
        if (!verifyResult.success) {
            throw new Error('Failed to verify image upload');
        }

        return {
            id: uploadResult.data.file.id,
            name: uploadResult.data.file.name,
            url: verifyResult.data.downloadUrl,
            thumbnailUrl: verifyResult.data.downloadUrl,
            size: uploadResult.data.file.size,
            category: uploadResult.data.file.category,
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
                console.warn('File upload was aborted');
            } else {
                console.error('File upload failed:', error);
                // TODO: Translate error message
                setUploadError('Failed to upload image. Please try again.');
            }
            throw error;
        }
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setFile(file);
    };

    return {
        uploadError,
        handleFileChange,
        handleUploadComplete,
    };
};

interface EditLessonComponentsProps {
    lessonId: number;
    components: LessonElement[];
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
}

interface LessonComponentProps {
    lessonId: number;
    elementInstance: LessonElement;
    locale: TLocale;
    setComponents: React.Dispatch<React.SetStateAction<LessonElement[]>>;
    onUpClick: (id: string) => void;
    onDownClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
}

function RichTextComponent({
    elementInstance,
    locale,
    setComponents,
    onUpClick,
    onDownClick,
    onDeleteClick,
}: LessonComponentProps) {
    const onContentChange = (value: string) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id
                    ? { ...comp, content: value }
                    : comp,
            ),
        );
    };

    return (
        <RichTextDesignerComponent
            elementInstance={elementInstance as RichTextElement}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onContentChange={onContentChange}
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
}: LessonComponentProps) {
    return (
        <HeadingDesignerComponent
            elementInstance={elementInstance as HeadingElement}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={(value) => {
                setComponents((prev) =>
                    prev.map((comp) =>
                        comp.id === elementInstance.id
                            ? {
                                  ...comp,
                                  heading: value.heading,
                                  headingType: value.type,
                              }
                            : comp,
                    ),
                );
            }}
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
}: LessonComponentProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (
                    comp.id === elementInstance.id &&
                    comp.type === CourseElementType.VideoFile
                ) {
                    return {
                        ...comp,
                        file: file as fileMetadata.TFileMetadataVideo,
                    };
                }
                return comp;
            }),
        );
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleDownload = () => {
        if (elementInstance.file) {
            downloadFile(elementInstance.file.url, elementInstance.file.name);
        }
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'video',
            setFile,
        });

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
        <div className="flex flex-col gap-2">
            <VideoDesignerComponent
                elementInstance={elementInstance as VideoElement}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                maxSize={15} // TODO: tweak file size
                onVideoUpload={onVideoUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
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
}: LessonComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (
                    comp.id === elementInstance.id &&
                    comp.type === CourseElementType.ImageFile
                ) {
                    return {
                        ...comp,
                        file: file as fileMetadata.TFileMetadataImage,
                    };
                }
                return comp;
            }),
        );
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleDownload = () => {
        if (elementInstance.file) {
            downloadFile(elementInstance.file.url, elementInstance.file.name);
        }
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'image',
            setFile,
        });

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
        <div className="flex flex-col gap-2">
            <ImageDesignerComponent
                elementInstance={elementInstance as ImageElement}
                locale={locale}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
                maxSize={15} // TODO: tweak file size
                onImageUpload={onImageUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={handleDownload}
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
}: LessonComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageGallery) return null;

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (
                    comp.id === elementInstance.id &&
                    comp.type === CourseElementType.ImageGallery
                ) {
                    const images = comp.images ? [...comp.images] : [];
                    return {
                        ...comp,
                        images: [
                            ...images,
                            file as fileMetadata.TFileMetadataImage,
                        ],
                    };
                }
                return comp;
            }),
        );
    };

    const handleDelete = (id: string) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (
                    comp.id === elementInstance.id &&
                    comp.type === CourseElementType.ImageGallery
                ) {
                    return {
                        ...comp,
                        images:
                            comp.images?.filter((img) => img.id !== id) ?? null,
                    };
                }
                return comp;
            }),
        );
    };

    const handleDownload = (id: string) => {
        const file = elementInstance.images?.find((img) => img.id === id);
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'image',
            setFile,
        });

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
        <div className="flex flex-col gap-2">
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
                maxSize={15} // TODO: tweak file size
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
}: LessonComponentProps) {
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;

    const setFile = (file: fileMetadata.TFileMetadata | null) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (
                    comp.id === elementInstance.id &&
                    comp.type === CourseElementType.DownloadFiles
                ) {
                    const files = comp.files ? [...comp.files] : [];
                    return {
                        ...comp,
                        files: [...files, file as fileMetadata.TFileMetadata],
                    };
                }
                return comp;
            }),
        );
    };

    const handleDelete = (id: string) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (
                    comp.id === elementInstance.id &&
                    comp.type === CourseElementType.DownloadFiles
                ) {
                    return {
                        ...comp,
                        files:
                            comp.files?.filter((file) => file.id !== id) ??
                            null,
                    };
                }
                return comp;
            }),
        );
    };

    const handleDownload = (id: string) => {
        const file = elementInstance.files?.find((file) => file.id === id);
        if (file) {
            downloadFile(file.url, file.name);
        }
    };

    const { uploadError, handleFileChange, handleUploadComplete } =
        useFileUpload({
            lessonId,
            componentType: 'downloadFiles',
            setFile,
        });

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
                maxSize={15} // TODO: tweak file size
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
                comp.id === elementInstance.id ? { ...comp, isRequired } : comp,
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
}: LessonComponentProps) {
    if (elementInstance.type !== CourseElementType.UploadFiles) return null;

    const onDescriptionChange = (description: string) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id
                    ? { ...comp, description }
                    : comp,
            ),
        );
    };

    return (
        <UploadFilesDesignerComponent
            elementInstance={elementInstance}
            locale={locale}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onDeleteClick={onDeleteClick}
            onChange={onDescriptionChange}
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
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.SingleChoice) return null;

    const onChange = (
        title: string,
        options: SingleChoiceElement['options'],
    ) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id &&
                comp.type === FormElementType.SingleChoice
                    ? { ...comp, title, options }
                    : comp,
            ),
        );
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id &&
                comp.type === FormElementType.SingleChoice
                    ? { ...comp, required: isRequired }
                    : comp,
            ),
        );
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
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.MultiCheck) return null;

    const onChange = (title: string, options: MultiCheckElement['options']) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id &&
                comp.type === FormElementType.MultiCheck
                    ? { ...comp, title, options }
                    : comp,
            ),
        );
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id &&
                comp.type === FormElementType.MultiCheck
                    ? { ...comp, required: isRequired }
                    : comp,
            ),
        );
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
}: LessonComponentProps) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;

    const onChange = (updatedData: OneOutOfThreeData) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id &&
                comp.type === FormElementType.OneOutOfThree
                    ? { ...comp, data: updatedData }
                    : comp,
            ),
        );
    };

    const onRequiredChange = (isRequired: boolean) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === elementInstance.id &&
                comp.type === FormElementType.OneOutOfThree
                    ? { ...comp, required: isRequired }
                    : comp,
            ),
        );
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

    useEffect(() => {
        if (!lessonComponentsViewModel) return;
        if (lessonComponentsViewModel.mode !== 'default') return;

        setComponents(
            transformLessonComponents(
                lessonComponentsViewModel.data.components,
            ),
        );
        setCourseVersion(lessonComponentsViewModel.data.courseVersion);
    }, [lessonComponentsViewModel]);

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

    if (!lessonComponentsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (lessonComponentsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

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
                    />
                );
            })}
        </div>
    );
}
