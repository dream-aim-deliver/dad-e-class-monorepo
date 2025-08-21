'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    CourseForm,
    DefaultError,
    DefaultLoading,
    IconSave,
    SectionHeading,
    useCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { viewModels } from '@maany_shr/e-class-models';
import { Suspense, useEffect, useState } from 'react';
import { trpc } from '../../trpc/client';
import { useCreateCoursePresenter } from '../../hooks/use-create-course-presenter';
import { useRouter } from 'next/navigation';
import { useGetCourseShortPresenter } from '../../hooks/use-course-short-presenter';
import { useCourseImageUpload } from '../common/hooks/use-course-image-upload';

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

    const getSubmitErrorMessage = () => {
        const hasViewModelError =
            createCourseViewModel && createCourseViewModel.mode !== 'default';

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
    } = useCourseForm();

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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
                {/* TODO: Add translations */}
                <SectionHeading text="Create Course" />
                <Button
                    variant="primary"
                    onClick={handleCreateCourse}
                    text="Submit"
                    hasIconLeft
                    iconLeft={<IconSave />}
                    disabled={isSubmitDisabled}
                />
            </div>

            <CourseForm
                mode="create"
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
    const [duplicationCourseViewModel, setDuplicationCourseViewModel] =
        useState<viewModels.TCourseShortViewModel | undefined>(undefined);
    const { presenter: duplicationCoursePresenter } =
        useGetCourseShortPresenter(setDuplicationCourseViewModel);
    duplicationCoursePresenter.present(
        duplicationCourseResponse,
        duplicationCourseViewModel,
    );

    if (!duplicationCourseViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (duplicationCourseViewModel.mode === 'not-found') {
        // TODO: Translate error message
        return (
            <DefaultError
                description="Could not find the course to duplicate"
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
            <Suspense fallback={<DefaultLoading locale={locale} />}>
                <CreateCourseWithDuplication
                    duplicationCourseSlug={duplicationCourseSlug}
                />
            </Suspense>
        );
    }
    return <CreateCourseContent />;
}
