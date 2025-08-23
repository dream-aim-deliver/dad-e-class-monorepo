'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    AbortError,
    Button,
    calculateMd5,
    CreateCourseForm,
    DefaultError,
    DefaultLoading,
    downloadFile,
    IconSave,
    uploadToS3,
    useCreateCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { Suspense, useEffect, useState } from 'react';
import { trpc } from '../../trpc/client';
import { useCreateCoursePresenter } from '../../hooks/use-create-course-presenter';
import { useRouter } from 'next/navigation';
import { useGetCourseShortPresenter } from '../../hooks/use-course-short-presenter';

const useCreateCourse = () => {
    const router = useRouter();
    const createMutation = trpc.createCourse.useMutation();

    const [createCourseViewModel, setCreateCourseViewModel] = useState<
        viewModels.TCreateCourseViewModel | undefined
    >(undefined);
    const { presenter: createCoursePresenter } = useCreateCoursePresenter(
        setCreateCourseViewModel,
    );

    // Navigation effect after successful creation
    useEffect(() => {
        if (createMutation.isSuccess) {
            createCoursePresenter.present(
                createMutation.data,
                createCourseViewModel,
            );
        }
    }, [createMutation.isSuccess]);

    // Redirect to courses page after success
    useEffect(() => {
        if (createCourseViewModel?.mode === 'default') {
            setTimeout(() => {
                router.push('/workspace/courses');
            }, 1000);
        }
    }, [createCourseViewModel]);

    const createCourseTranslations = useTranslations('pages.createCourse');

    const getSubmitErrorMessage = () => {
        const hasViewModelError =
            createCourseViewModel && createCourseViewModel.mode !== 'default';

        if (createCourseViewModel?.mode === 'invalid') {
            // TODO: Decide if we can pass the error message directly
            return createCourseViewModel.data.message;
        }
        if (createMutation.error || hasViewModelError) {
            return createCourseTranslations('courseCreationError');
        }
        return undefined;
    };

    const createCourse = async (courseData: {
        title: string;
        slug: string;
        description: string;
        imageFileId: string;
    }) => {
        createMutation.mutate(courseData);
    };

    return {
        createCourse,
        isCreating: createMutation.isPending,
        isSuccess: createMutation.isSuccess,
        getSubmitErrorMessage,
    };
};

// Custom hook for image upload logic
const useCourseImageUpload = () => {
    const uploadMutation = trpc.uploadCourseImage.useMutation();
    const verifyMutation = trpc.verifyFile.useMutation();

    const [courseImage, setCourseImage] =
        useState<fileMetadata.TFileMetadataImage | null>(null);
    const [uploadError, setUploadError] = useState<string | undefined>(
        undefined,
    );

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

    const createCourseTranslations = useTranslations('pages.createCourse');

    const handleFileChange = async (
        uploadRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        setUploadError(undefined);
        try {
            return await uploadImage(uploadRequest, abortSignal);
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn('File upload was aborted');
            } else {
                console.error('File upload failed:', error);
                setUploadError(createCourseTranslations('uploadError'));
            }
            throw error;
        }
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadataImage) => {
        setCourseImage(file);
    };

    const handleDelete = (id: string) => {
        if (courseImage?.id === id) {
            setCourseImage(null);
        }
    };

    const handleDownload = async (id: string) => {
        if (courseImage?.id !== id) return;
        downloadFile(courseImage.url, courseImage.name);
    };

    return {
        courseImage,
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    };
};

interface CreateCourseContentProps {
    duplicationCourse?: {
        title: string;
        imageUrl?: string;
    };
}

function CreateCourseContent(props: CreateCourseContentProps) {
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

    const { createCourse, isCreating, isSuccess, getSubmitErrorMessage } =
        useCreateCourse();

    const {
        courseImage,
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    } = useCourseImageUpload();

    const [validationError, setValidationError] = useState<string | undefined>(
        undefined,
    );

    const validateCourse = (): string | undefined => {
        if (!courseTitle || !courseSlug) {
            return createCourseTranslations('titleSlugError');
        }
        if (!courseDescription || !isDescriptionValid()) {
            return createCourseTranslations('descriptionError');
        }
        // TODO: Add more client validation logic as needed
        if (!courseImage) {
            return createCourseTranslations('missingImageError');
        }
        return undefined;
    };

    const handleCreateCourse = async () => {
        setValidationError(undefined);

        const validationError = validateCourse();
        if (validationError) {
            setValidationError(validationError);
            return;
        }

        await createCourse({
            title: courseTitle,
            slug: courseSlug,
            description: serializeDescription(),
            imageFileId: courseImage!.id,
        });
    };

    const isSubmitDisabled = isSuccess || isCreating;
    const errorMessage =
        validationError ?? uploadError ?? getSubmitErrorMessage();

    const createCourseTranslations = useTranslations('pages.createCourse');

    return (
        <div className="flex flex-col gap-4 px-30">
            <div className="flex w-full items-center justify-between">
                <h1> {createCourseTranslations('createTitle')} </h1>
                <Button
                    variant="primary"
                    onClick={handleCreateCourse}
                    text={createCourseTranslations('saveDraftButton')}
                    hasIconLeft
                    iconLeft={<IconSave />}
                    disabled={isSubmitDisabled}
                />
            </div>
            <div>
                <CreateCourseForm
                    image={courseImage}
                    courseTitle={courseTitle}
                    setCourseTitle={setCourseTitle}
                    courseSlug={courseSlug}
                    setCourseSlug={setCourseSlug}
                    courseDescription={courseDescription}
                    setCourseDescription={setCourseDescription}
                    onFileChange={handleFileChange}
                    onUploadComplete={handleUploadComplete}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    locale={locale}
                    errorMessage={errorMessage}
                    hasSuccess={isSuccess}
                    duplicationCourse={props.duplicationCourse}
                />
            </div>
        </div>
    );
}

function CreateCourseWithDuplication({
    duplicationCourseSlug,
}: {
    duplicationCourseSlug: string;
}) {
    const locale = useLocale() as TLocale;

    const [duplicationCourseResponse] = trpc.getCourseShort.useSuspenseQuery({
        courseSlug: duplicationCourseSlug,
    });
    const createCourseTranslations = useTranslations('pages.createCourse');

    const [duplicationCourseViewModel, setDuplicationCourseViewModel] =
        useState<viewModels.TCourseShortViewModel | undefined>(undefined);
    const { presenter: duplicationCoursePresenter } =
        useGetCourseShortPresenter(setDuplicationCourseViewModel);
    duplicationCoursePresenter.present(
        duplicationCourseResponse,
        duplicationCourseViewModel,
    );

    if (!duplicationCourseViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (duplicationCourseViewModel.mode === 'not-found') {
        return (
            <DefaultError
                description={createCourseTranslations(
                    'duplicationDefaultError',
                )}
                locale={locale}
            />
        );
    }

    if (duplicationCourseViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    return (
        <CreateCourseContent
            duplicationCourse={{
                title: duplicationCourseViewModel.data.title,
                imageUrl: duplicationCourseViewModel.data.imageUrl ?? undefined,
            }}
        />
    );
}

export default function CreateCourse({
    duplicationCourseSlug,
}: {
    duplicationCourseSlug?: string;
}) {
    const locale = useLocale() as TLocale;
    if (duplicationCourseSlug) {
        return (
            <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                <CreateCourseWithDuplication
                    duplicationCourseSlug={duplicationCourseSlug}
                />
            </Suspense>
        );
    }
    return <CreateCourseContent />;
}
