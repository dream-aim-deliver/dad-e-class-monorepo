import {
    AbortError,
    calculateMd5,
    downloadFile,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { useTranslations } from 'next-intl';

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
export const useIntroductionVideoUpload = (
    slug: string,
    onProgressUpdate?: (progress: number) => void,
): IntroductionVideoUploadState => {
    const useIntroductionVideoUploadTranslations = useTranslations('components.useCourseImageUpload');
    const uploadCredentialsError = useIntroductionVideoUploadTranslations('uploadCredentialsError');
    const verifyImageError = useIntroductionVideoUploadTranslations('verifyImageError');
    const uploadAbortError = useIntroductionVideoUploadTranslations('uploadAbortError');
    const uploadFailedError = useIntroductionVideoUploadTranslations('uploadFailedError');

    const utils = trpc.useUtils();

    const uploadMutation = trpc.uploadIntroductionVideo.useMutation({
        onSuccess: () => {
            // Invalidate course introduction to show updated video
            utils.getCourseIntroduction.invalidate({ courseSlug: slug });
        },
    });
    const verifyMutation = trpc.getDownloadUrl.useMutation();

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
            // @ts-ignore
            storageUrl: uploadResult.data.storageUrl,
            // @ts-ignore
            objectName: uploadResult.data.file.objectName,
            // @ts-ignore
            formFields: uploadResult.data.formFields,
            abortSignal,
            onProgress: (uploadProgress) => {
                onProgressUpdate?.(30 + Math.round(uploadProgress * 0.7));
            },
        });

        const verifyResult = await verifyMutation.mutateAsync({
            // @ts-ignore
            fileId: uploadResult.data.file.id,
        });
        if (!verifyResult.success) {
            throw new Error(verifyImageError);
        }

        return {
            // @ts-ignore
            id: uploadResult.data.file.id,
            // @ts-ignore
            name: uploadResult.data.file.name,
            // @ts-ignore
            url: verifyResult.data.downloadUrl,
            // @ts-ignore
            thumbnailUrl: verifyResult.data.downloadUrl,
            // @ts-ignore
            size: uploadResult.data.file.size,
            // @ts-ignore
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