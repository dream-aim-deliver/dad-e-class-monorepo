import { fileMetadata } from '@maany_shr/e-class-models';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/cms-client';
import {
    AbortError,
    calculateMd5,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';
import type { TUploadLessonProgressFileSuccessResponse, TGetDownloadUrlSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';

export interface FileUploadConfig {
    lessonId: number;
}

export interface FileUploadService {
    uploadFile: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        componentId: string,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata | null>;
    uploadError?: string;
}

export const simulateUploadFile = (
    file: File,
): Promise<fileMetadata.TFileMetadata> => {
    const blobUrl = URL.createObjectURL(file);
    return Promise.resolve({
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        url: blobUrl,
        status: 'available',
        category: 'generic',
    });
};

export type FileUploadMode = 'mock' | 'real';

const FileUploadContext = createContext<FileUploadService | undefined>(
    undefined,
);

interface FileUploadProviderProps {
    children: ReactNode;
    mode: FileUploadMode;
    config: FileUploadConfig;
}

export const useMockFileUpload = (): FileUploadService => {
    const uploadFile = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        componentId: string,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata | null> => {
        const mockFile = await simulateUploadFile(uploadRequest.file);

        if (abortSignal?.aborted) return null;

        return mockFile;
    };

    return {
        uploadFile,
        uploadError: undefined,
    };
};

export const useRealProgressUpload = (
    config: FileUploadConfig,
): FileUploadService => {
    const editLessonTranslations = useTranslations(
        'components.useCourseImageUpload',
    );
    const utils = trpc.useUtils();

    const uploadMutation = trpc.uploadLessonProgressFile.useMutation({
        onSuccess: () => {
            // Invalidate lesson components to show updated progress files
            utils.listLessonComponents.invalidate({ lessonId: config.lessonId, withProgress: true });
        },
    });
    const verifyMutation = trpc.getDownloadUrl.useMutation();

    const [uploadError, setUploadError] = useState<string | undefined>();

    const uploadFile = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        componentId: string,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata | null> => {
        setUploadError(undefined);

        try {
            if (abortSignal?.aborted) {
                throw new AbortError();
            }

            const checksum = await calculateMd5(uploadRequest.file);

            const uploadResult = await uploadMutation.mutateAsync({
                lessonId: config.lessonId,
                componentId: componentId,
                name: uploadRequest.name,
                checksum,
                mimeType: uploadRequest.file.type,
                size: uploadRequest.file.size,
            });

            if (!uploadResult.success) {
                throw new Error(
                    editLessonTranslations('uploadCredentialsError'),
                );
            }

            // Type assertion after success check
            const uploadData = uploadResult.data as TUploadLessonProgressFileSuccessResponse['data'];

            if (abortSignal?.aborted) {
                throw new AbortError();
            }

            await uploadToS3({
                file: uploadRequest.file,
                checksum,
                storageUrl: uploadData.storageUrl,
                objectName: uploadData.file.objectName,
                formFields: uploadData.formFields,
                abortSignal,
            });

            const verifyResult = await verifyMutation.mutateAsync({
                fileId: uploadData.file.id,
            });

            if (!verifyResult.success) {
                throw new Error(editLessonTranslations('verifyImageError'));
            }

            const verifyData = verifyResult.data as TGetDownloadUrlSuccessResponse['data'];

            return {
                id: uploadData.file.id,
                name: uploadData.file.name,
                url: verifyData.downloadUrl,
                thumbnailUrl: verifyData.downloadUrl,
                size: uploadData.file.size,
                category: uploadData.file.category,
                status: 'available' as const,
            } as fileMetadata.TFileMetadata;
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn(editLessonTranslations('uploadAbortError'));
            } else {
                console.error('Real file upload failed:', error);
                setUploadError(editLessonTranslations('uploadFailedError'));
            }
            throw error;
        }
    };

    return {
        uploadFile,
        uploadError,
    };
};

export const FileUploadProvider: React.FC<FileUploadProviderProps> = ({
    children,
    mode,
    config,
}) => {
    const mockService = useMockFileUpload();
    const realService = useRealProgressUpload(config);

    const uploadService = mode === 'mock' ? mockService : realService;

    return (
        <FileUploadContext.Provider value={uploadService}>
            {children}
        </FileUploadContext.Provider>
    );
};

export const useFileUploadContext = () => {
    const context = useContext(FileUploadContext);
    if (context === undefined) {
        throw new Error(
            'useFileUploadContext must be used within a FileUploadProvider',
        );
    }
    return context;
};
