import {
    AbortError,
    calculateMd5,
    downloadFile,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../trpc/client';
import { useTranslations } from 'next-intl';

export interface CourseImageUploadState {
    courseImage: fileMetadata.TFileMetadataImage | null;
    uploadError: string | undefined;
    handleFileChange: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    handleUploadComplete: (file: fileMetadata.TFileMetadataImage) => void;
    handleDelete: (id: string) => void;
    handleDownload: (id: string) => void;
}

// Custom hook for image upload logic
export const useCourseImageUpload = (
    initialImage: fileMetadata.TFileMetadataImage | null = null,
    onProgressUpdate?: (progress: number) => void,
): CourseImageUploadState => {
    const useCourseImageUploadTranslations = useTranslations('components.useCourseImageUpload');
    const uploadCredentialsError = useCourseImageUploadTranslations('uploadCredentialsError');
    const verifyImageError = useCourseImageUploadTranslations('verifyImageError');
    const uploadAbortError = useCourseImageUploadTranslations('uploadAbortError');
    const uploadFailedError = useCourseImageUploadTranslations('uploadFailedError');

    const uploadMutation = trpc.uploadCourseImage.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [courseImage, setCourseImage] =
        useState<fileMetadata.TFileMetadataImage | null>(initialImage);
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
            name: uploadRequest.name,
            checksum,
            mimeType: uploadRequest.file.type,
            size: uploadRequest.file.size,
        });
        if (!uploadResult.success) {
            throw new Error(uploadCredentialsError);
        }

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Comment out to test without the storage running
        // Track upload progress (30-100% of total)
        await uploadToS3({
            file: uploadRequest.file,
            checksum,
            storageUrl: uploadResult.data.storageUrl,
            objectName: uploadResult.data.file.objectName,
            formFields: uploadResult.data.formFields,
            abortSignal,
            onProgress: (uploadProgress) => {
                onProgressUpdate?.(30 + Math.round(uploadProgress * 0.7));
            },
        });

        const verifyResult = await verifyMutation.mutateAsync({
            fileId: uploadResult.data.file.id,
        });
        if (!verifyResult.success) {
            throw new Error(verifyImageError);
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
                console.warn(uploadAbortError);
            } else {
                console.error('File upload failed:', error);
                setUploadError(uploadFailedError);
            }
            throw error;
        }
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadataImage) => {
        setCourseImage(file);
    };

    const handleDelete = (id: string) => {
        if (courseImage?.id === id) {
            setCourseImage(null);
        }
    };

    const handleDownload = async (id: string) => {
        if (courseImage?.id !== id) return;
        downloadFile(courseImage.url, courseImage.name);
    };

    return {
        courseImage,
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    };
};
