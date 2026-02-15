'use client';

import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import {
    Breadcrumbs,
    Button,
    CourseForm,
    DefaultError,
    DefaultLoading,
    IconSave,
    useCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { viewModels } from '@maany_shr/e-class-models';
import { Suspense, useEffect, useState } from 'react';
import { useCreateCoursePresenter } from '../../hooks/use-create-course-presenter';
import { useRouter } from 'next/navigation';
import { useGetCourseShortPresenter } from '../../hooks/use-get-course-short-presenter';
import { useCourseImageUpload } from '../common/hooks/use-course-image-upload';
import { trpc } from '../../trpc/cms-client';

const useCreateCourse = () => {
    const router = useRouter();
    const utils = trpc.useUtils();
    const createMutation = trpc.createCourse.useMutation({
        onSuccess: () => {
            // Invalidate queries to refetch fresh course list
            utils.listUserCourses.invalidate();
            utils.listPlatformCoursesShort.invalidate();
        },
    });

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
                // @ts-ignore
                createMutation.data,
                createCourseViewModel,
            );
        }
    }, [createMutation.isSuccess]);

    // Redirect to courses page after success
    useEffect(() => {
        if (createCourseViewModel?.mode === 'default') {
            // ✅ Navigate immediately - no artificial delay
            router.push('/workspace/courses');
        }
    }, [createCourseViewModel]);

    const createCourseTranslations = useTranslations('pages.createCourse');

    const getSubmitErrorMessage = () => {
        const hasViewModelError =
            createCourseViewModel && createCourseViewModel.mode !== 'default';

        // Check for specific error types in kaboom and not-found modes
        if (createCourseViewModel?.mode === 'kaboom' || createCourseViewModel?.mode === 'not-found') {
            const errorType = createCourseViewModel.data.context?.errorType;
            if (errorType === 'slug_already_exists') {
                return createCourseTranslations('slugAlreadyExistsError');
            }
            // Return the specific error message from the backend
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
        isSuccess: createCourseViewModel?.mode === 'default',
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
    const dictionary = getDictionary(locale);

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

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);

    const {
        courseImage,
        uploadError,
        handleFileChange,
        handleUploadComplete,
        handleDelete,
        handleDownload,
    } = useCourseImageUpload(null, setUploadProgress);

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

    const errorMessage =
        validationError ?? uploadError ?? getSubmitErrorMessage();
    const hasBeenCreated = isSuccess && !errorMessage;
    const isSubmitDisabled = hasBeenCreated || isCreating;

    const createCourseTranslations = useTranslations('pages.createCourse');
    const breadcrumbTranslations = useTranslations('components.breadcrumbs');
    const router = useRouter();

    const breadcrumbItems = [
        {
            label: breadcrumbTranslations('home'),
            onClick: () => router.push('/'),
        },
        {
            label: breadcrumbTranslations('workspace'),
            onClick: () => router.push('/workspace'),
        },
        {
            label: breadcrumbTranslations('courses'),
            onClick: () => router.push('/workspace/courses'),
        },
        {
            label: courseTitle || breadcrumbTranslations('newCourse'),
            onClick: () => {
                // No-op: course doesn't exist yet during creation
            },
        },
        {
            label: breadcrumbTranslations('createCourse'),
            onClick: () => {
                // Nothing should happen on clicking the current page
            },
        },
    ];

    return (
        <div className="flex flex-col gap-4 px-30">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex w-full items-center justify-between">
                <h1> {createCourseTranslations('createTitle')} </h1>
                <Button
                    variant="primary"
                    onClick={handleCreateCourse}
                    text={
                        isCreating
                            ? dictionary.components.editHeader.savingText
                            : createCourseTranslations('saveDraftButton')
                    }
                    hasIconLeft
                    iconLeft={<IconSave />}
                    disabled={isSubmitDisabled}
                />
            </div>

            <CourseForm
                mode="create"
                courseVersion={null}
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
                hasSuccess={hasBeenCreated}
                duplicationCourse={props.duplicationCourse}
                uploadProgress={uploadProgress}
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
    const createCourseTranslations = useTranslations('pages.createCourse');

    const [duplicationCourseViewModel, setDuplicationCourseViewModel] =
        useState<viewModels.TCourseShortViewModel | undefined>(undefined);
    const { presenter: duplicationCoursePresenter } =
        useGetCourseShortPresenter(setDuplicationCourseViewModel);
    duplicationCoursePresenter.present(
        // @ts-ignore
        duplicationCourseResponse,
        duplicationCourseViewModel,
    );

    if (!duplicationCourseViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (duplicationCourseViewModel.mode === 'not-found') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={createCourseTranslations('error.title')}
                description={createCourseTranslations(
                    'duplicationDefaultError',
                )}
            />
        );
    }

    if (duplicationCourseViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={createCourseTranslations('error.title')}
                description={createCourseTranslations('error.description')}
            />
        );
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
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <CreateCourseWithDuplication
                    duplicationCourseSlug={duplicationCourseSlug}
                />
            </Suspense>
        );
    }
    return <CreateCourseContent />;
}
