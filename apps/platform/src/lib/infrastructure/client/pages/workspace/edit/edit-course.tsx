'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    CourseGeneralInformationView,
    DefaultError,
    DefaultLoading,
    SectionHeading,
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
        return <DefaultLoading locale={locale} variant='minimal'/>;
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

function EditCourseContent({ slug, course }: EditCourseContentProps) {
    const locale = useLocale() as TLocale;
    const {
        activeTab,
        setActiveTab,
        isEdited,
        setIsEdited,
        isPreviewing,
        setIsPreviewing,
        handleTabChange,
        handlePreview,
        editWrap,
    } = useEditCourseState();

    const { courseVersion, setCourseVersion, errorMessage, setErrorMessage } =
        useCourseVersionState(course.courseVersion);

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

    const {
        generalState,
        courseImageUpload,
        saveCourseDetails,
        saveDetailsMutation,
    } = useCourseDetailsState({
        course,
        slug,
        courseVersion,
        setErrorMessage,
    });

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

    const isSaving = isSavingCourseStructure || saveDetailsMutation.isPending;

    return (
        <EditCourseLayout
            onPreview={handlePreview}
            onSave={handleSave}
            onTabChange={handleTabChange}
            isEdited={isEdited}
            isSaving={isSaving}
            isPreviewing={isPreviewing}
            activeTab={activeTab}
            errorMessage={errorMessage}
            locale={locale}
        >
            <EditCourseTabContent
                course={course}
                activeTab={activeTab}
                slug={slug}
                locale={locale}
                isPreviewing={isPreviewing}
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                generalState={generalState}
                courseImageUpload={courseImageUpload}
                modules={modules}
                setModules={setModules}
                setCourseVersion={setCourseVersion}
                editWrap={editWrap}
            />
        </EditCourseLayout>
    );
}

function useEditCourseState() {
    const [isEdited, setIsEdited] = useState(false);
    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.General);
    const [isPreviewing, setIsPreviewing] = useState(false);

    const editWrap = <T extends Array<any>, U>(fn: (...args: T) => U) => {
        return (...args: T): U => {
            setIsEdited(true);
            return fn(...args);
        };
    };

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
        setActiveTab(value as TabTypes);
    };

    const handlePreview = () => {
        setIsPreviewing((prev) => !prev);
    };

    return {
        activeTab,
        setActiveTab,
        isEdited,
        setIsEdited,
        isPreviewing,
        setIsPreviewing,
        handleTabChange,
        handlePreview,
        editWrap,
    };
}

function useCourseVersionState(initialVersion: number) {
    const [courseVersion, setCourseVersion] = useState<number | null>(
        initialVersion,
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return {
        courseVersion,
        setCourseVersion,
        errorMessage,
        setErrorMessage,
    };
}

function useCourseDetailsState({
    course,
    slug,
    courseVersion,
    setErrorMessage,
}: {
    course: viewModels.TEnrolledCourseDetailsSuccess;
    slug: string;
    courseVersion: number | null;
    setErrorMessage: (message: string | null) => void;
}) {
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

    const saveDetailsMutation = trpc.saveCourseDetails.useMutation();

    const saveCourseDetails = async () => {
        if (!courseVersion) return;
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

    return {
        generalState,
        courseImageUpload,
        saveCourseDetails,
        saveDetailsMutation,
    };
}

interface EditCourseLayoutProps {
    onPreview: () => void;
    onSave: () => Promise<void>;
    onTabChange: (value: string) => void;
    isEdited: boolean;
    isSaving: boolean;
    isPreviewing: boolean;
    activeTab: TabTypes;
    errorMessage: string | null;
    locale: TLocale;
    children: React.ReactNode;
}

function EditCourseLayout({
    onPreview,
    onSave,
    onTabChange,
    isEdited,
    isSaving,
    isPreviewing,
    errorMessage,
    locale,
    children,
}: EditCourseLayoutProps) {
    const tabContentClass = 'mt-5';

    return (
        <div className="flex flex-col gap-4">
            <EditHeader
                title="Edit course"
                onPreview={onPreview}
                onSave={onSave}
                disablePreview={isEdited || isSaving}
                isSaving={isSaving}
                isPreviewing={isPreviewing}
            />
            <Tabs.Root
                defaultTab={TabTypes.General}
                onValueChange={onTabChange}
            >
                <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
                    <Tabs.Trigger
                        value={TabTypes.General}
                        disabled={isSaving || isPreviewing}
                        isLast={false}
                    >
                        General
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={TabTypes.IntroOutline}
                        disabled={isSaving || isPreviewing}
                        isLast={false}
                    >
                        Intro & Outline
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={TabTypes.CourseContent}
                        disabled={isSaving || isPreviewing}
                        isLast={true}
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
                {children}
            </Tabs.Root>
        </div>
    );
}

interface GeneralTabPreviewProps {
    course: viewModels.TEnrolledCourseDetailsSuccess;
}

function GeneralTabPreview({ course }: GeneralTabPreviewProps) {
    const locale = useLocale() as TLocale;

    return (
        <div className="flex flex-col space-y-4">
            <SectionHeading text={course.title} />
            <CourseGeneralInformationView
                // These fields aren't utilized and are coming from a common model
                title={''}
                description={''}
                showProgress={false}
                language={{
                    name: '',
                    code: '',
                }}
                pricing={{
                    fullPrice: 0,
                    partialPrice: 0,
                    currency: '',
                }}
                locale={locale}
                longDescription={course.description}
                duration={{
                    video: course.duration.video ?? 0,
                    coaching: course.duration.coaching ?? 0,
                    selfStudy: course.duration.selfStudy ?? 0,
                }}
                rating={course.author.averageRating}
                author={{
                    name: course.author.name + ' ' + course.author.surname,
                    image: course.author.avatarUrl ?? '',
                }}
                imageUrl={course.imageFile?.downloadUrl ?? ''}
                students={course.students.map((student) => ({
                    name: student.name,
                    avatarUrl: student.avatarUrl ?? '',
                }))}
                totalStudentCount={course.studentCount}
                onClickAuthor={() => {
                    // Don't handle author click
                }}
            />
        </div>
    );
}

interface EditCourseTabContentProps {
    activeTab: TabTypes;
    course: viewModels.TEnrolledCourseDetailsSuccess;
    slug: string;
    locale: TLocale;
    isPreviewing: boolean;
    isEdited: boolean;
    setIsEdited: (edited: boolean) => void;
    generalState: any;
    courseImageUpload: any;
    modules: any;
    setModules: any;
    setCourseVersion: any;
    editWrap: <T extends Array<any>, U>(
        fn: (...args: T) => U,
    ) => (...args: T) => U;
}

function EditCourseTabContent({
    activeTab,
    slug,
    course,
    locale,
    isPreviewing,
    isEdited,
    setIsEdited,
    generalState,
    courseImageUpload,
    modules,
    setModules,
    setCourseVersion,
    editWrap,
}: EditCourseTabContentProps) {
    const tabContentClass = 'mt-5';

    return (
        <>
            <Tabs.Content value={TabTypes.General} className={tabContentClass}>
                {isPreviewing && <GeneralTabPreview course={course} />}
                {!isPreviewing && (
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
                )}
            </Tabs.Content>
            <Tabs.Content
                value={TabTypes.IntroOutline}
                className={tabContentClass}
            >
                <Suspense fallback={<DefaultLoading locale={locale} variant='minimal'/>}>
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
                {isPreviewing && <EnrolledCoursePreview courseSlug={slug} />}
                {!isPreviewing && (
                    <Suspense fallback={<DefaultLoading locale={locale} variant='minimal'/>}>
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
        </>
    );
}