import {
    AbortError,
    calculateMd5,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../trpc/cms-client';


type HomePageUploadType = 
    | "upload_home_page_accordion_item" 
    | "upload_home_page_coaching_on_demand_banner_mobile" 
    | "upload_home_page_coaching_on_demand_banner_tablet" 
    | "upload_home_page_coaching_on_demand_banner_desktop" 
    | "upload_home_page_carousel_item_image" 
    | "upload_home_page_hero_image"
    | "upload_offers_page_carousel_card_image"
    | "upload_coaching_page_banner_image";

export interface HomePageFileUploadState {
    uploadError: string | undefined;
    handleFileUpload: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        uploadType: HomePageUploadType,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    handleFileDelete: (id: string) => void;
    handleFileDownload: (id: string) => void;
}

/**
 * Custom hook for homepage file uploads
 * Handles banner thumbnails, carousel images, and coaching on demand images
 * @param onProgressUpdate - Optional callback to track upload progress (0-100)
 */
export const useHomePageFileUpload = (
    onProgressUpdate?: (progress: number) => void,
): HomePageFileUploadState => {
    const requestFileUploadMutation = trpc.requestFileUpload.useMutation();
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [uploadError, setUploadError] = useState<string | undefined>(undefined);

    const uploadFile = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        uploadType: HomePageUploadType,
        abortSignal?: AbortSignal,
    ) => {
        if (abortSignal?.aborted) {
            throw new AbortError();
        }

        // Track MD5 calculation progress (0-30% of total)
        const checksum = await calculateMd5(uploadRequest.file, (md5Progress) => {
            onProgressUpdate?.(Math.round(md5Progress * 0.3));
        });

        // Request upload credentials from server with specific upload type
        const uploadResult = await requestFileUploadMutation.mutateAsync({
            upload: {
                name: uploadRequest.name,
                checksum,
                mimeType: uploadRequest.file.type,
                size: uploadRequest.file.size,
                uploadType: uploadType, // Dynamic upload type based on section
            }
        });

       

        if (!uploadResult.success) {
            throw new Error('Failed to get upload credentials');
        }

        // Narrow uploadResult.data to a typed variable so TypeScript knows the shape
        const uploadData = uploadResult.data as {
            storageUrl: string;
            file: {
                id: string;
                name: string;
                objectName: string;
                size: number;
                category: string;
            };
            formFields: Record<string, string>;
        };
        
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

        if (!verifyResult.success) {
            throw new Error('Failed to verify uploaded file');
        }

        // Type assertion for verify result
        const verifyData = verifyResult.data as { downloadUrl: string };

        return {
            id: uploadData.file.id,
            name: uploadData.file.name,
            url: verifyData.downloadUrl,
            thumbnailUrl: verifyData.downloadUrl,
            size: uploadData.file.size,
            category: uploadData.file.category,
        } as fileMetadata.TFileMetadata;
    };

    const handleFileUpload = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        uploadType: HomePageUploadType,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        setUploadError(undefined);
        try {
            return await uploadFile(uploadRequest, uploadType, abortSignal);
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

    const handleFileDelete = (id: string) => {
        // Note: This only handles client-side cleanup
        // Actual server deletion would require a separate API call
        console.log('File marked for deletion:', id);
    };

    const handleFileDownload = async (id: string) => {
        // Download functionality would require fetching the file metadata first
        console.log('Download file:', id);
    };

    return {
        uploadError,
        handleFileUpload,
        handleFileDelete,
        handleFileDownload,
    };
};
