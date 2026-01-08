import {
    AbortError,
    calculateMd5,
    downloadFile,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { TUploadCourseImageSuccessResponse, TGetDownloadUrlSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { useState } from 'react';
import { trpc } from '../../../trpc/cms-client';
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

        // Type assertion after success check
        const uploadData = uploadResult.data as TUploadCourseImageSuccessResponse['data'];

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
            throw new Error(verifyImageError);
        }

        const verifyData = verifyResult.data as TGetDownloadUrlSuccessResponse['data'];

        return {
            id: uploadData.file.id,
            name: uploadData.file.name,
            url: verifyData.downloadUrl,
            thumbnailUrl: verifyData.downloadUrl,
            size: uploadData.file.size,
            category: uploadData.file.category,
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
