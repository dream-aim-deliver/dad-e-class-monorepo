'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultError,
    DefaultLoading,
    Tabs,
    useCourseForm,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';
import EditCourseStructure from './edit-course-structure';
import { useSaveStructure } from './hooks/save-hooks';
import EditHeader from './components/edit-header';
import EnrolledCoursePreview from '../../course/enrolled-course/enrolled-course-preview';
import EditCourseGeneral from './edit-course-general';
import { trpc } from '../../../trpc/client';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';
import { useCourseImageUpload } from '../../common/hooks/use-course-image-upload';

interface EditCourseProps {
    slug: string;
}

enum TabTypes {
    General = 'general',
    IntroOutline = 'intro-outline',
    CourseContent = 'course-content',
}

export default function EditCourse({ slug }: EditCourseProps) {
    const locale = useLocale() as TLocale;

    // This is external as rich text is internally controlled
    // Hence it can't be changed after rendering with initial value
    const [courseResponse] = trpc.getEnrolledCourseDetails.useSuspenseQuery(
        {
            courseSlug: slug,
        },
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
            staleTime: Infinity,
        },
    );
    const [courseViewModel, setCourseViewModel] = useState<
        viewModels.TEnrolledCourseDetailsViewModel | undefined
    >(undefined);
    const { presenter: coursePresenter } =
        useGetEnrolledCourseDetailsPresenter(setCourseViewModel);
    coursePresenter.present(courseResponse, courseViewModel);

    if (!courseViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return <EditCourseContent slug={slug} course={courseViewModel.data} />;
}

interface EditCourseContentProps {
    slug: string;
    course: viewModels.TEnrolledCourseDetailsSuccess;
}

// TODO: Translate
function EditCourseContent({ slug, course }: EditCourseContentProps) {
    const tabContentClass = 'mt-5';
    const locale = useLocale() as TLocale;

    const [isEdited, setIsEdited] = useState(false);

    const editWrap = <T extends Array<any>, U>(fn: (...args: T) => U) => {
        return (...args: T): U => {
            setIsEdited(true);
            return fn(...args);
        };
    };

    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.General);

    const [courseVersion, setCourseVersion] = useState<number | null>(
        course.courseVersion,
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const transformCourseImage = (): fileMetadata.TFileMetadataImage | null => {
        return course.imageFile
            ? {
                  ...course.imageFile,
                  status: 'available',
                  url: course.imageFile.downloadUrl,
                  thumbnailUrl: course.imageFile.downloadUrl,
              }
            : null;
    };

    const {
        modules,
        setModules,
        saveCourseStructure,
        isSavingCourseStructure,
    } = useSaveStructure({
        slug,
        courseVersion,
        setCourseVersion,
        errorMessage,
        setErrorMessage,
    });
    const [isPreviewing, setIsPreviewing] = useState(false);

    const handleTabChange = (value: string) => {
        if (isEdited) {
            const confirmSwitch = confirm(
                'You have unsaved changes. Are you sure you want to switch tabs?',
            );
            if (!confirmSwitch) {
                throw new Error('Tab switch cancelled due to unsaved changes.');
            }
        }
        setIsEdited(false);
        setModules([]);
        setActiveTab(value as TabTypes);
        setErrorMessage(null);
    };

    const handlePreview = () => {
        setIsPreviewing((prev) => !prev);
    };

    const saveDetailsMutation = trpc.saveCourseDetails.useMutation();

    const saveCourseDetails = async () => {
        if (!courseVersion) return;
        // TODO: Translate error messages
        if (!generalState.courseTitle) {
            setErrorMessage('Course title is required');
            return;
        }
        if (!generalState.serializeDescription()) {
            setErrorMessage('Course description is required');
            return;
        }
        if (Number.isNaN(generalState.duration)) {
            setErrorMessage('Course duration is invalid');
            return;
        }
        if (!courseImageUpload.courseImage) {
            setErrorMessage('Course image is required');
            return;
        }

        setErrorMessage(null);
        const result = await saveDetailsMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            title: generalState.courseTitle,
            description: generalState.serializeDescription(),
            selfStudyDuration: generalState.duration,
            imageId: courseImageUpload.courseImage?.id,
        });
        if (!result.success) {
            setErrorMessage(result.data.message);
            return;
        }
        window.location.reload();
    };

    const handleSave = async () => {
        if (activeTab === TabTypes.General) {
            await saveCourseDetails();
        }
        if (activeTab === TabTypes.CourseContent) {
            const result = await saveCourseStructure();
            if (result) {
                setIsEdited(false);
            }
            return;
        }
    };

    const generalState = useCourseForm({
        courseTitle: course.title,
        courseDescription: course.description,
        duration: course.duration.selfStudy ?? undefined,
    });

    const courseImageUpload = useCourseImageUpload(transformCourseImage());

    useEffect(() => {
        const courseImage = transformCourseImage();
        if (!courseImage) return;
        courseImageUpload.handleUploadComplete(courseImage);
    }, [course]);

    const isSaving = isSavingCourseStructure || saveDetailsMutation.isPending;

    return (
        <div className="flex flex-col gap-4">
            <EditHeader
                title="Edit course"
                onPreview={handlePreview}
                onSave={handleSave}
                disablePreview={isEdited || isSaving}
                isSaving={isSaving}
                isPreviewing={isPreviewing}
            />
            <Tabs.Root
                defaultTab={TabTypes.General}
                onValueChange={handleTabChange}
            >
                <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
                    <Tabs.Trigger
                        value={TabTypes.General}
                        disabled={isSaving || isPreviewing}
                    >
                        General
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={TabTypes.IntroOutline}
                        disabled={isSaving || isPreviewing}
                    >
                        Intro & Outline
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={TabTypes.CourseContent}
                        disabled={isSaving || isPreviewing}
                    >
                        Course Content
                    </Tabs.Trigger>
                </Tabs.List>
                {errorMessage && (
                    <DefaultError
                        locale={locale}
                        className={tabContentClass}
                        title="Error saving the course"
                        description={errorMessage}
                    />
                )}
                <Tabs.Content
                    value={TabTypes.General}
                    className={tabContentClass}
                >
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <EditCourseGeneral
                            slug={slug}
                            courseForm={{
                                ...generalState,
                                setCourseTitle: editWrap(
                                    generalState.setCourseTitle,
                                ),
                                setCourseDescription: editWrap(
                                    generalState.setCourseDescription,
                                ),
                                setDuration: editWrap(generalState.setDuration),
                            }}
                            uploadImage={{
                                ...courseImageUpload,
                                handleDelete: editWrap(
                                    courseImageUpload.handleDelete,
                                ),
                            }}
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content
                    value={TabTypes.IntroOutline}
                    className={tabContentClass}
                >
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <DefaultError
                            locale={locale}
                            title="Not implemented yet"
                            description="This feature is not implemented yet."
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content
                    value={TabTypes.CourseContent}
                    className={tabContentClass}
                >
                    {isPreviewing && (
                        <EnrolledCoursePreview courseSlug={slug} />
                    )}
                    {!isPreviewing && (
                        <Suspense fallback={<DefaultLoading locale={locale} />}>
                            <EditCourseStructure
                                slug={slug}
                                isEdited={isEdited}
                                setIsEdited={setIsEdited}
                                modules={modules}
                                setModules={setModules}
                                setCourseVersion={setCourseVersion}
                            />
                        </Suspense>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
