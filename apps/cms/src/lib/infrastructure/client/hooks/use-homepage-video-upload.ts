import {
    AbortError,
    calculateMd5,
    downloadFile,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../trpc/cms-client';

export interface HomePageVideoUploadState {
    video: fileMetadata.TFileMetadataVideo | null;
    uploadError: string | undefined;
    handleFileChange: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    handleUploadComplete: (file: fileMetadata.TFileMetadataVideo) => void;
    handleDelete: (id: string) => void;
    handleDownload: (id: string) => void;
}

/**
 * Custom hook for homepage hero video upload logic
 * Similar to course introduction video upload but for homepage
 */
export const useHomePageVideoUpload = (
    onProgressUpdate?: (progress: number) => void,
): HomePageVideoUploadState => {
    const uploadMutation = trpc.uploadHomePageVideo.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [video, setVideo] = useState<fileMetadata.TFileMetadataVideo | null>(null);
    const [uploadError, setUploadError] = useState<string | undefined>(undefined);

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

        // Request upload credentials for homepage video
        const uploadResult = await uploadMutation.mutateAsync({
            name: uploadRequest.name,
            checksum,
            mimeType: uploadRequest.file.type,
            size: uploadRequest.file.size,
        });

        if (!uploadResult.success) {
            throw new Error('Failed to get video upload credentials');
        }

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

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
            throw new Error('Failed to verify video upload');
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
                console.warn('Video upload cancelled');
            } else {
                console.error('Video upload failed:', error);
                setUploadError(error instanceof Error ? error.message : 'Video upload failed');
            }
            throw error;
        }
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadataVideo) => {
        setVideo(file);
    };

    const handleDelete = (id: string) => {
        if (video?.id === id) {
            setVideo(null);
        }
    };

    const handleDownload = async (id: string) => {
        if (video?.id !== id) return;
        downloadFile(video.url, video.name);
    };

    return {
        video,
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    };
};
