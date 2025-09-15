import { fileMetadata } from '@maany_shr/e-class-models';
import { createContext, ReactNode, useContext, useState } from 'react';
import { simulateUploadFile } from '../../../../common/mocks/simple/upload-file';
import { useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/client';
import {
    AbortError,
    calculateMd5,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';

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

export const useRealFileUpload = (
    config: FileUploadConfig,
): FileUploadService => {
    const editLessonTranslations = useTranslations(
        'components.useCourseImageUpload',
    );
    const uploadMutation = trpc.uploadLessonComponentFile.useMutation();
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
                componentType: 'uploadFiles',
                // componentId: config.componentId,
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

            if (abortSignal?.aborted) {
                throw new AbortError();
            }

            await uploadToS3({
                file: uploadRequest.file,
                checksum,
                storageUrl: uploadResult.data.storageUrl,
                objectName: uploadResult.data.file.objectName,
                formFields: uploadResult.data.formFields,
                abortSignal,
            });

            const verifyResult = await verifyMutation.mutateAsync({
                fileId: uploadResult.data.file.id,
            });

            if (!verifyResult.success) {
                throw new Error(editLessonTranslations('verifyImageError'));
            }

            return {
                id: uploadResult.data.file.id,
                name: uploadResult.data.file.name,
                url: verifyResult.data.downloadUrl,
                thumbnailUrl: verifyResult.data.downloadUrl,
                size: uploadResult.data.file.size,
                category: uploadResult.data.file.category,
                status: 'available',
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
    const realService = useRealFileUpload(config);

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
