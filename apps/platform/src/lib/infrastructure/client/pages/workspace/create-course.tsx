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
            resolve(hash.toString(CryptoJS.enc.Hex));
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
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
    } = useCreateCourseForm();

    const uploadMutation = trpc.uploadCourseImage.useMutation();
    const verifyMutation = trpc.verifyCourseImage.useMutation();

    const [courseImage, setCourseImage] =
        useState<fileMetadata.TFileMetadataImage | null>(null);

    const uploadImage = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        if (abortSignal?.aborted) {
            throw new Error('Upload was aborted');
        }

        // For mutations, we aren't able to abort them midway.
        // Hence, we check for abort signal before each step.
        const uploadResult = await uploadMutation.mutateAsync({
            name: uploadRequest.name,
            checksum: await calculateMd5(uploadRequest.file),
            mimeType: uploadRequest.file.type,
            size: uploadRequest.file.size,
        });
        if (!uploadResult.success) {
            throw new Error('Failed to upload image');
        }

        if (abortSignal?.aborted) {
            throw new Error('Upload was aborted');
        }

        // TODO: perform MinIO upload

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
                    onClick={() => {
                        // Handle create course logic
                    }}
                    // TODO: Add translations
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
            />
        </div>
    );
}
