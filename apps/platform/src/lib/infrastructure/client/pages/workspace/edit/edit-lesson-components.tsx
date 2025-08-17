import React, { useState } from 'react';
import { useLessonComponents } from './hooks/edit-lesson-hooks';
import {
    AbortError,
    calculateMd5,
    CourseElementType,
    DefaultError,
    downloadFile,
    FormElementType,
    HeadingDesignerComponent,
    HeadingElement,
    LessonElement,
    RichTextDesignerComponent,
    RichTextElement,
    uploadToS3,
    VideoDesignerComponent,
    VideoElement,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../../trpc/client';
import { fileMetadata } from '@maany_shr/e-class-models';

interface FileUploadProps {
    lessonId: number;
    componentType: string;
    file: fileMetadata.TFileMetadata | null;
    setFile: (file: fileMetadata.TFileMetadata | null) => void;
}

const useFileUpload = ({
    lessonId,
    componentType,
    file,
    setFile,
}: FileUploadProps) => {
    // TODO: Replace with specific upload implementation
    const uploadMutation = trpc.uploadCourseImage.useMutation();
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
            // TODO: Pass lessonId and componentType
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

    const handleDelete = (id: string) => {
        if (file?.id === id) {
            setFile(null);
        }
    };

    const handleDownload = async (id: string) => {
        if (file?.id !== id) return;
        downloadFile(file.url, file.name);
    };

    return {
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
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

    const {
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    } = useFileUpload({
        lessonId,
        componentType: 'video',
        file: elementInstance.file,
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
                maxSize={15}
                onVideoUpload={onVideoUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={() => {
                    handleDelete(elementInstance.file!.id);
                }}
                onFileDownload={() => handleDownload(elementInstance.file!.id)}
            />
            {uploadError && (
                <DefaultError locale={locale} description={uploadError} />
            )}
        </div>
    );
}

const typeToRendererMap: Record<any, React.FC<LessonComponentProps>> = {
    [FormElementType.RichText]: RichTextComponent,
    [FormElementType.HeadingText]: HeadingComponent,
    [CourseElementType.VideoFile]: VideoComponent,
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
