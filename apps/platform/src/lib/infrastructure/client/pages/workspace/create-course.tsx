'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    CreateCourseForm,
    IconSave,
    SectionHeading,
    useCreateCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../trpc/client';
import CryptoJS from 'crypto-js';

// TODO: Move this utility function to a shared utilities file
async function calculateMd5(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            if (!event.target || !event.target.result) {
                reject(new Error('Failed to read file'));
                return;
            }
            const arrayBuffer = event.target.result as ArrayBuffer;
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
            const hash = CryptoJS.MD5(wordArray);
            resolve(CryptoJS.enc.Base64.stringify(hash));
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

// TODO: Move this upload function to a shared utilities file
interface UploadToS3Params {
    file: File;
    checksum: string;
    objectName: string;
    storageUrl: string;
    formFields: Record<string, string>;
    abortSignal?: AbortSignal;
}

async function uploadToS3({
    file,
    storageUrl,
    objectName,
    checksum,
    formFields,
    abortSignal,
}: UploadToS3Params): Promise<void> {
    const formData = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
        formData.append(key, value);
    });
    formData.append('key', objectName);
    formData.append('Content-Type', file.type);
    formData.append('Content-MD5', checksum);

    formData.append('file', file);

    const response = await fetch(storageUrl, {
        method: 'POST',
        body: formData,
        signal: abortSignal,
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }
}

export default function CreateCourse() {
    const locale = useLocale() as TLocale;

    const {
        courseTitle,
        setCourseTitle,
        courseSlug,
        setCourseSlug,
        courseDescription,
        setCourseDescription,
        isDescriptionValid,
    } = useCreateCourseForm();

    const uploadMutation = trpc.uploadCourseImage.useMutation();
    const verifyMutation = trpc.verifyCourseImage.useMutation();

    const [courseImage, setCourseImage] =
        useState<fileMetadata.TFileMetadataImage | null>(null);

    const [error, setError] = useState<string | undefined>(undefined);

    const validateCourse = (): string | undefined => {
        // TODO: Translate error messages
        if (!courseTitle || !courseSlug) {
            return 'Please fill in title and slug';
        }
        if (!courseDescription || !isDescriptionValid()) {
            return 'Please provide a course description';
        }
        // TODO: Add more client validation logic as needed
        if (!courseImage) {
            return 'Please upload a course image';
        }
        return undefined;
    };

    const createCourse = async () => {
        setError(undefined);

        const validationError = validateCourse();
        if (validationError) {
            setError(validationError);
            return;
        }

        // TODO: Handle create course logic
    };

    const uploadImage = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        if (abortSignal?.aborted) {
            throw new Error('Upload was aborted');
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
            throw new Error('Failed to upload image');
        }

        if (abortSignal?.aborted) {
            throw new Error('Upload was aborted');
        }

        // Comment out to test without the storage running
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

    // TODO: decompose download logic for reuse
    const downloadImage = async (id: string) => {
        if (courseImage?.id !== id) return;
        try {
            const response = await fetch(courseImage.url);
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = courseImage.name;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
                {/* TODO: Add translations */}
                <SectionHeading text="Create Course" />
                <Button
                    variant="primary"
                    onClick={createCourse}
                    text="Save"
                    hasIconLeft
                    iconLeft={<IconSave />}
                />
            </div>

            <CreateCourseForm
                image={courseImage}
                courseTitle={courseTitle}
                setCourseTitle={setCourseTitle}
                courseSlug={courseSlug}
                setCourseSlug={setCourseSlug}
                courseDescription={courseDescription}
                setCourseDescription={setCourseDescription}
                onFileChange={uploadImage}
                onUploadComplete={(file) => {
                    setCourseImage(file);
                }}
                onDelete={(id: string) => {
                    if (courseImage?.id === id) {
                        setCourseImage(null);
                    }
                }}
                onDownload={downloadImage}
                locale={locale}
                errorMessage={error}
            />
        </div>
    );
}
