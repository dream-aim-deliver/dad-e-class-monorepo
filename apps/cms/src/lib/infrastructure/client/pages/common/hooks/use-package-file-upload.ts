import {
    AbortError,
    calculateMd5,
    downloadFile,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../trpc/cms-client';
import { useTranslations } from 'next-intl';

export interface PackageFileUploadState {
    packageFile: fileMetadata.TFileMetadata | null;
    uploadError: string | undefined;
    handleFileChange: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    handleUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    handleDelete: (id: string) => void;
    handleDownload: (id: string) => void;
}

// Custom hook for package file upload logic
export const usePackageFileUpload = (
    uploadType: "upload_package_image" | "upload_package_accordion_item_icon",
    initialFile: fileMetadata.TFileMetadata | null = null,
    onProgressUpdate?: (progress: number) => void,
): PackageFileUploadState => {
    const usePackageFileUploadTranslations = useTranslations('components.useCourseImageUpload');
    const uploadCredentialsError = usePackageFileUploadTranslations('uploadCredentialsError');
    const verifyImageError = usePackageFileUploadTranslations('verifyImageError');
    const uploadAbortError = usePackageFileUploadTranslations('uploadAbortError');
    const uploadFailedError = usePackageFileUploadTranslations('uploadFailedError');

    const uploadMutation = trpc.requestFileUpload.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [packageFile, setPackageFile] =
        useState<fileMetadata.TFileMetadata | null>(initialFile);
    const [uploadError, setUploadError] = useState<string | undefined>(
        undefined,
    );

    const uploadFile = async (
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
            upload: {
                name: uploadRequest.name,
                checksum,
                mimeType: uploadRequest.file.type,
                size: uploadRequest.file.size,
                uploadType: uploadType,
            },
        });
        if (!uploadResult.success) {
            throw new Error(uploadCredentialsError);
        }

        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Comment out to test without the storage running
        // Track upload progress (30-100% of total)
        const data = uploadResult.data as {
            storageUrl: string;
            formFields: Record<string, string>;
            file: {
                id: string;
                name: string;
                size: number;
                category: fileMetadata.TFileCategoryEnum;
                objectName: string;
            };
        };

        await uploadToS3({
            file: uploadRequest.file,
            checksum,
            storageUrl: data.storageUrl,
            objectName: data.file.objectName,
            formFields: data.formFields,
            abortSignal,
            onProgress: (uploadProgress) => {
                onProgressUpdate?.(30 + Math.round(uploadProgress * 0.7));
            },
        });

        const verifyResult = await verifyMutation.mutateAsync({
            fileId: data.file.id,
        });
        if (!verifyResult.success) {
            throw new Error(verifyImageError);
        }

        const verifyData = verifyResult.data as { downloadUrl: string };

        return {
            id: data.file.id,
            name: data.file.name,
            url: verifyData.downloadUrl,
            thumbnailUrl: verifyData.downloadUrl,
            size: data.file.size,
            category: data.file.category,
        } as fileMetadata.TFileMetadata;
    };

    const handleFileChange = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        setUploadError(undefined);
        try {
            return await uploadFile(uploadRequest, abortSignal);
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

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setPackageFile(file);
    };

    const handleDelete = (id: string) => {
        if (packageFile?.id === id) {
            setPackageFile(null);
        }
    };

    const handleDownload = async (id: string) => {
        if (packageFile?.id !== id) return;
        downloadFile(packageFile.url, packageFile.name);
    };

    return {
        packageFile,
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    };
};
