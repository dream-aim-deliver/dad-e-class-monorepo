import { fileMetadata } from '@maany_shr/e-class-models';
import { createContext, ReactNode, useContext, useState } from 'react';
import { trpc } from '../../../trpc/cms-client';
import {
    AbortError,
    calculateMd5,
    uploadToS3,
} from '@maany_shr/e-class-ui-kit';

export interface AssessmentFileUploadConfig {
    courseSlug: string;
}

export interface AssessmentFileUploadService {
    uploadFile: (
        uploadRequest: fileMetadata.TFileUploadRequest,
        componentId: string,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata | null>;
    uploadError?: string;
}

const AssessmentFileUploadContext = createContext<
    AssessmentFileUploadService | undefined
>(undefined);

interface AssessmentFileUploadProviderProps {
    children: ReactNode;
    config: AssessmentFileUploadConfig;
}

export const useAssessmentFileUploadService = (
    config: AssessmentFileUploadConfig,
): AssessmentFileUploadService => {
    const utils = trpc.useUtils();

    const requestFileUploadMutation = trpc.requestFileUpload.useMutation();
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

            // Request upload credentials from server with assessment-specific upload type
            // Files are uploaded with courseSlug and then associated with the assessment component
            // when the assessment progress is submitted via fileIds in the progress object.
            const uploadResult = await requestFileUploadMutation.mutateAsync({
                upload: {
                    name: uploadRequest.name,
                    checksum,
                    mimeType: uploadRequest.file.type,
                    size: uploadRequest.file.size,
                    courseSlug: config.courseSlug,
                    uploadType: 'upload_pre_course_assessment_file',
                },
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

            // Upload file to S3
            await uploadToS3({
                file: uploadRequest.file,
                checksum,
                storageUrl: uploadData.storageUrl,
                objectName: uploadData.file.objectName,
                formFields: uploadData.formFields,
                abortSignal,
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
                category: uploadData.file.category as fileMetadata.TFileCategoryEnum,
                status: 'available',
            } as fileMetadata.TFileMetadata;
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn('Upload cancelled by user');
            } else {
                console.error('Assessment file upload failed:', error);
                setUploadError(
                    error instanceof Error ? error.message : 'Upload failed',
                );
            }
            throw error;
        }
    };

    return {
        uploadFile,
        uploadError,
    };
};

export const AssessmentFileUploadProvider: React.FC<
    AssessmentFileUploadProviderProps
> = ({ children, config }) => {
    const uploadService = useAssessmentFileUploadService(config);

    return (
        <AssessmentFileUploadContext.Provider value={uploadService}>
            {children}
        </AssessmentFileUploadContext.Provider>
    );
};

export const useAssessmentFileUploadContext = () => {
    const context = useContext(AssessmentFileUploadContext);
    if (context === undefined) {
        throw new Error(
            'useAssessmentFileUploadContext must be used within an AssessmentFileUploadProvider',
        );
    }
    return context;
};

