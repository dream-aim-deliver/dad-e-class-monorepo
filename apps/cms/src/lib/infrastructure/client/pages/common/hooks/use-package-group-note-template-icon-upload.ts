import {
    AbortError,
    calculateMd5,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../trpc/cms-client';

export interface PackageGroupNoteTemplateIconUploadState {
    uploadError: string | undefined;
    handleFileUpload: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        packageId: number,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
}

/**
 * Extracts the download URL from a getDownloadUrl result payload.
 * The tRPC output type of getDownloadUrl is wrapped twice, so the payload
 * is narrowed at runtime instead of relying on the declared type.
 */
const extractDownloadUrl = (payload: unknown): string | undefined => {
    if (
        typeof payload === 'object' &&
        payload !== null &&
        'downloadUrl' in payload &&
        typeof payload.downloadUrl === 'string'
    ) {
        return payload.downloadUrl;
    }
    return undefined;
};

/**
 * Custom hook for group note template icon uploads (package-level template)
 * @param onProgressUpdate - Optional callback to track upload progress (0-100)
 */
export const usePackageGroupNoteTemplateIconUpload = (
    onProgressUpdate?: (progress: number) => void,
): PackageGroupNoteTemplateIconUploadState => {
    const requestFileUploadMutation = trpc.requestFileUpload.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [uploadError, setUploadError] = useState<string | undefined>(undefined);

    const uploadFile = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        packageId: number,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Track MD5 calculation progress (0-30% of total)
        const checksum = await calculateMd5(uploadRequest.file, (md5Progress) => {
            onProgressUpdate?.(Math.round(md5Progress * 0.3));
        });

        // Request upload credentials from server
        const uploadResult = await requestFileUploadMutation.mutateAsync({
            upload: {
                name: uploadRequest.name,
                checksum,
                mimeType: uploadRequest.file.type,
                size: uploadRequest.file.size,
                uploadType: 'upload_package_group_note_template_icon',
                packageId,
            },
        });

        if (uploadResult.success !== true) {
            throw new Error('Failed to get upload credentials');
        }

        const uploadData = uploadResult.data;

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Upload file to S3 (30-100% of progress)
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

        // Verify upload and get download URL
        const verifyResult = await verifyMutation.mutateAsync({
            fileId: uploadData.file.id,
        });

        if (verifyResult.success !== true) {
            throw new Error('Failed to verify uploaded file');
        }

        const downloadUrl = extractDownloadUrl(verifyResult.data);
        if (!downloadUrl) {
            throw new Error('Failed to verify uploaded file');
        }

        return {
            id: uploadData.file.id,
            name: uploadData.file.name,
            size: uploadData.file.size,
            status: 'available',
            category: 'image',
            url: downloadUrl,
            thumbnailUrl: downloadUrl,
        };
    };

    const handleFileUpload = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        packageId: number,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        setUploadError(undefined);
        try {
            return await uploadFile(uploadRequest, packageId, abortSignal);
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn('Upload cancelled by user');
            } else {
                console.error('File upload failed:', error);
                setUploadError(error instanceof Error ? error.message : 'Upload failed');
            }
            throw error;
        }
    };

    return {
        uploadError,
        handleFileUpload,
    };
};
