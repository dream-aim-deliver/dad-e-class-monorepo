import {
    AbortError,
    calculateMd5,
    downloadFile,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../../trpc/client';

export interface IntroductionVideoUploadState {
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

// Custom hook for video upload logic
export const useIntroductionVideoUpload = (): IntroductionVideoUploadState => {
    const uploadMutation = trpc.uploadCourseImage.useMutation();
    const verifyMutation = trpc.verifyFile.useMutation();

    const [video, setVideo] = useState<fileMetadata.TFileMetadataVideo | null>(
        null,
    );
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

        const checksum = await calculateMd5(uploadRequest.file);

        // For mutations, we aren't able to abort them midway.
        // Hence, we check for abort signal before each step.
        const uploadResult = await uploadMutation.mutateAsync({
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
            return await uploadVideo(uploadRequest, abortSignal);
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
