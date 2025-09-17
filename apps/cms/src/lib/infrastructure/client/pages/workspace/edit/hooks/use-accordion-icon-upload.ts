import {
    AbortError,
    calculateMd5,
    downloadFile,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../../trpc/client';
import { useTranslations } from 'next-intl';

export interface AccordionIconUploadState {
    uploadError: string | undefined;
    handleFileChange: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    handleDownload: (icon: fileMetadata.TFileMetadataImage) => void;
}

// Custom hook for icon upload logic
export const useAccordionIconUpload = (
    slug: string,
    onProgressUpdate?: (progress: number) => void,
): AccordionIconUploadState => {
    const useAccordionIconUploadTranslations = useTranslations('components.useCourseImageUpload');
    const uploadCredentialsError = useAccordionIconUploadTranslations('uploadCredentialsError');
    const verifyImageError = useAccordionIconUploadTranslations('verifyImageError');
    const uploadAbortError = useAccordionIconUploadTranslations('uploadAbortError');
    const uploadFailedError = useAccordionIconUploadTranslations('uploadFailedError');

    const uploadMutation = trpc.uploadAccordionIcon.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [uploadError, setUploadError] = useState<string | undefined>(
        undefined,
    );

    const uploadVideo = async (
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
            courseSlug: slug,
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
            return await uploadVideo(uploadRequest, abortSignal);
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

    const handleDownload = async (icon: fileMetadata.TFileMetadataImage) => {
        downloadFile(icon.url, icon.name);
    };

    return {
        uploadError,
        handleFileChange,
        handleDownload,
    };
};