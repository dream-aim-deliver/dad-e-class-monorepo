'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    AbortError,
    Button,
    calculateMd5,
    CreateCourseForm,
    downloadFile,
    IconSave,
    SectionHeading,
    uploadToS3,
    useCreateCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { useEffect, useState } from 'react';
import { trpc } from '../../trpc/client';
import { useCreateCoursePresenter } from '../../hooks/use-create-course-presenter';

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
        serializeDescription,
    } = useCreateCourseForm();

    const uploadMutation = trpc.uploadCourseImage.useMutation();
    const verifyMutation = trpc.verifyCourseImage.useMutation();
    const createMutation = trpc.createCourse.useMutation();

    const [createCourseViewModel, setCreateCourseViewModel] = useState<
        viewModels.TCreateCourseViewModel | undefined
    >(undefined);
    const { presenter: createCoursePresenter } = useCreateCoursePresenter(
        setCreateCourseViewModel,
    );

    useEffect(() => {
        if (createMutation.isSuccess) {
            createCoursePresenter.present(
                createMutation.data,
                createCourseViewModel,
            );
        }
    }, [createMutation.isSuccess]);

    useEffect(() => {
        if (createCourseViewModel?.mode === 'default') {
            alert('Course created successfully!');
            // TODO: Handle successful course creation
        }
    }, [createCourseViewModel]);

    const hasViewModelError =
        createCourseViewModel && createCourseViewModel.mode !== 'default';

    const getSubmitErrorMessage = () => {
        if (createCourseViewModel?.mode === 'invalid') {
            // TODO: Decide if we can pass the error message directly
            return createCourseViewModel.data.message;
        }
        if (createMutation.error || hasViewModelError) {
            // TODO: Translate error message
            return 'Course creation failed. Please try again.';
        }
        return undefined;
    };

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

        createMutation.mutate({
            title: courseTitle,
            slug: courseSlug,
            description: serializeDescription(),
            imageFileId: courseImage!.id,
        });
    };

    const uploadImage = async (
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

    const onFileChange = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        setError(undefined);
        try {
            return await uploadImage(uploadRequest, abortSignal);
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn('File upload was aborted');
            } else {
                console.error('File upload failed:', error);
                // TODO: Translate error message
                setError('Failed to upload image. Please try again.');
            }
            throw error;
        }
    };

    const downloadImage = async (id: string) => {
        if (courseImage?.id !== id) return;
        downloadFile(courseImage.url, courseImage.name);
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
                onFileChange={onFileChange}
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
                errorMessage={error ?? getSubmitErrorMessage()}
            />
        </div>
    );
}
