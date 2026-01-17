'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';
import {
    AccordionBuilderItem,
    Banner,
    Breadcrumbs,
    CourseDetailsState,
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    Tabs,
    useTabContext,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import EditCourseStructure from './edit-course-structure';
import { useSaveStructure } from './hooks/save-hooks';
import EditHeader from './components/edit-header';
import EnrolledCoursePreview from '../../course/enrolled-course/enrolled-course-preview';
import EditCourseGeneral, {
    EditCourseGeneralPreview,
} from './edit-course-general';
import { CourseImageUploadState } from '../../common/hooks/use-course-image-upload';
import EditCourseIntroOutline, {
    CourseIntroOutlinePreview,
} from './edit-course-intro-outline';
import { CourseModule } from './types';
import { TCourseStatus } from '@dream-aim-deliver/e-class-cms-rest';
import { useCourseDetails, useSaveDetails } from './hooks/edit-details-hooks';
import { useSaveIntroduction } from './hooks/edit-introduction-hooks';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';
import { useSaveOutline } from './hooks/edit-outline-hooks';
import { AccordionIconUploadState } from './hooks/use-accordion-icon-upload';
import { trpc } from '../../../trpc/cms-client';
import { useSaveAdminDetails } from './hooks/edit-admin-details-hooks';
import EditCourseAdminDetails from './edit-course-admin-details';

interface EditCourseProps {
    slug: string;
    defaultTab?: string;
    roles: string[];
}

enum TabTypes {
    General = 'general',
    IntroOutline = 'intro-outline',
    CourseContent = 'course-content',
    AdminDetails = 'admin-details',
}

export default function EditCourse({ slug, defaultTab, roles }: EditCourseProps) {
    const locale = useLocale() as TLocale;

    return (
        <EditCourseContent
            slug={slug}
            defaultTab={
                Object.values(TabTypes).includes(defaultTab as TabTypes)
                    ? (defaultTab as TabTypes)
                    : TabTypes.General
            }
            roles={roles}
        />
    );
}

interface EditCourseContentProps {
    slug: string;
    defaultTab: TabTypes;
    roles: string[];
}

function EditCourseContent({
    slug,
    defaultTab,
    roles,
}: EditCourseContentProps) {
    const locale = useLocale() as TLocale;
    const editCourseTranslations = useTranslations('pages.editCourse');

    const courseViewModel = useCourseDetails(slug);
    // Fetch course status from listUserCourses filtered by slug
    //const { data: userCoursesResponse } = trpc.listUserCourses.useQuery({});

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
    } = useEditCourseState(defaultTab);

    const { courseVersion, setCourseVersion, errorMessage, setErrorMessage, successMessage, setSuccessMessage } =
        useCourseVersionState();

    // General Tab State
    const {
        courseDetails,
        courseImageUpload,
        saveCourseDetails,
        isDetailsSaving,
    } = useSaveDetails({
        slug,
        courseVersion,
        setErrorMessage,
    });

    // Introduction Tab State
    const {
        courseIntroduction,
        introductionVideoUpload,
        isIntroductionSaving,
        saveCourseIntroduction,
        uploadProgress: introductionUploadProgress,
    } = useSaveIntroduction({
        slug,
        courseVersion,
        setErrorMessage,
    });

    // Outline Tab State
    const {
        outlineItems,
        accordionIconUpload,
        accordionUploadProgress,
        setOutlineItems,
        saveCourseOutline,
        isOutlineSaving,
    } = useSaveOutline({
        slug,
        courseVersion,
        setErrorMessage,
    });

    // Course Content Tab State
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

    // Admin Details Tab State (superadmin only)
    const {
        isPublic,
        setIsPublic,
        basePrice,
        setBasePrice,
        priceIncludingCoachings,
        setPriceIncludingCoachings,
        saveCourseAdminDetails,
        isAdminDetailsSaving,
    } = useSaveAdminDetails({
        slug,
        courseVersion,
        setErrorMessage,
    });

    // Handle error state after all hooks
    if (courseViewModel?.mode !== "default") {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={editCourseTranslations('error.title')}
                description={editCourseTranslations('error.description')}
            />
        );
    }
    const courseStatus = courseViewModel?.data.status

    // Wrap handlePreview with validation for each tab
    const handlePreviewWithValidation = () => {
        // General tab validation
        if (activeTab === TabTypes.General) {
            if (!courseDetails.courseTitle) {
                setErrorMessage(editCourseTranslations('titleRequiredForPreview'));
                return;
            }
            if (!courseDetails.serializeDescription()) {
                setErrorMessage(editCourseTranslations('descriptionRequiredForPreview'));
                return;
            }
            if (!courseDetails.duration || Number.isNaN(courseDetails.duration) || courseDetails.duration <= 0) {
                setErrorMessage(editCourseTranslations('durationRequiredForPreview'));
                return;
            }
            if (!courseImageUpload.courseImage) {
                setErrorMessage(editCourseTranslations('imageRequiredForPreview'));
                return;
            }
        }

        // IntroOutline tab validation
        if (activeTab === TabTypes.IntroOutline) {
            if (!courseIntroduction.introductionText) {
                setErrorMessage(editCourseTranslations('introductionRequiredForPreview'));
                return;
            }
            if (outlineItems.length < 1) {
                setErrorMessage(editCourseTranslations('outlineRequiredForPreview'));
                return;
            }
            for (const item of outlineItems) {
                if (!item.title || !item.content) {
                    setErrorMessage(editCourseTranslations('outlineItemsIncomplete'));
                    return;
                }
            }
        }

        // CourseContent tab validation
        if (activeTab === TabTypes.CourseContent) {
            if (modules.length < 1) {
                setErrorMessage(editCourseTranslations('modulesRequiredForPreview'));
                return;
            }
            // Check that at least one module has content (lessons or milestones)
            const hasContent = modules.some(module => module.content && module.content.length > 0);
            if (!hasContent) {
                setErrorMessage(editCourseTranslations('lessonsRequiredForPreview'));
                return;
            }
        }

        handlePreview();
    };

    const handleSave = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        let result;
        if (activeTab === TabTypes.General) {
            result = await saveCourseDetails();
        }
        if (activeTab === TabTypes.IntroOutline) {
            result = await saveCourseIntroduction();
            result = await saveCourseOutline();
        }
        if (activeTab === TabTypes.CourseContent) {
            result = await saveCourseStructure();
        }
        if (activeTab === TabTypes.AdminDetails) {
            result = await saveCourseAdminDetails();
        }
        if (result) {
            setIsEdited(false);
            setSuccessMessage(editCourseTranslations('saveSuccess'));
            // Auto-dismiss success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        }
    };

    const isSaving =
        isSavingCourseStructure ||
        isDetailsSaving ||
        isIntroductionSaving ||
        isOutlineSaving ||
        isAdminDetailsSaving;

    return (
        <EditCourseLayout
            onPreview={handlePreviewWithValidation}
            onSave={handleSave}
            onTabChange={handleTabChange}
            isEdited={isEdited}
            isSaving={isSaving}
            isPreviewing={isPreviewing}
            activeTab={activeTab}
            errorMessage={errorMessage}
            successMessage={successMessage}
            locale={locale}
            courseDetails={courseDetails}
            courseStatus={courseStatus}
            roles={roles}
            slug={slug}
        >
            <EditCourseTabContent
                courseVersion={courseVersion}
                activeTab={activeTab}
                slug={slug}
                locale={locale}
                isPreviewing={isPreviewing}
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                courseDetails={courseDetails}
                courseIntroduction={courseIntroduction}
                courseImageUpload={courseImageUpload}
                introductionVideoUpload={introductionVideoUpload}
                introductionUploadProgress={introductionUploadProgress}
                outlineItems={outlineItems}
                setOutlineItems={setOutlineItems}
                accordionIconUpload={accordionIconUpload}
                accordionUploadProgress={accordionUploadProgress}
                modules={modules}
                setModules={setModules}
                setCourseVersion={setCourseVersion}
                editWrap={editWrap}
                defaultTab={defaultTab}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                basePrice={basePrice}
                setBasePrice={setBasePrice}
                priceIncludingCoachings={priceIncludingCoachings}
                setPriceIncludingCoachings={setPriceIncludingCoachings}
                roles={roles}
                courseStatus={courseStatus}
            />
        </EditCourseLayout>
    );
}

function useEditCourseState(defaultTab: TabTypes) {
    const [isEdited, setIsEdited] = useState(false);
    const [activeTab, setActiveTab] = useState<TabTypes>(defaultTab);
    const [isPreviewing, setIsPreviewing] = useState(false);

    const editWrap = <T extends Array<any>, U>(fn: (...args: T) => U) => {
        return (...args: T): U => {
            setIsEdited(true);
            return fn(...args);
        };
    };
    const editCourseTranslations = useTranslations('pages.editCourse');

    const updateTabParameter = (newTabValue: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', newTabValue);
        window.history.pushState({}, '', url.toString());
    }

    const handleTabChange = (value: string) => {
        if (isEdited) {
            const confirmSwitch = confirm(
                editCourseTranslations('confirmSwitch'),
            );
            if (!confirmSwitch) {
                throw new Error(editCourseTranslations('tabSwitchCancelled'));
            }
        }
        setIsEdited(false);
        setActiveTab(value as TabTypes);
        updateTabParameter(value);
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

function useCourseVersionState() {
    const [courseVersion, setCourseVersion] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    return {
        courseVersion,
        setCourseVersion,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
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
    successMessage: string | null;
    locale: TLocale;
    courseDetails: CourseDetailsState;
    courseStatus?: TCourseStatus;
    roles: string[];
    slug: string;
    children: React.ReactNode;
}

// No-op function for closeable banners
const noOp = () => {
    // Intentionally empty - used for banner close handlers
};

function EditCourseLayout({
    onPreview,
    onSave,
    onTabChange,
    isEdited,
    isSaving,
    isPreviewing,
    activeTab,
    errorMessage,
    successMessage,
    locale,
    courseDetails,
    courseStatus,
    roles,
    slug,
    children,
}: EditCourseLayoutProps) {
    const tabContentClass = 'mt-5';
    const editCourseTranslations = useTranslations('pages.editCourse');
    const breadcrumbTranslations = useTranslations('components.breadcrumbs');
    const router = useRouter();

    const breadcrumbItems = [
        {
            label: breadcrumbTranslations('home'),
            onClick: () => router.push(`/${locale}`),
        },
        {
            label: breadcrumbTranslations('workspace'),
            onClick: () => router.push(`/${locale}/workspace`),
        },
        {
            label: breadcrumbTranslations('courses'),
            onClick: () => router.push(`/${locale}/workspace/courses`),
        },
        {
            label: courseDetails.courseTitle,
            onClick: () => router.push(`/${locale}/courses/${slug}`),
        },
        {
            label: breadcrumbTranslations('editCourse'),
            onClick: () => {
                // Nothing should happen on clicking the current page
            },
        },
    ];

    return (
        <div className="flex flex-col gap-4 px-15">
            <Breadcrumbs items={breadcrumbItems} />
            <EditHeader
                title={editCourseTranslations('editCourseTitle')}
                courseTitle={courseDetails.courseTitle}
                courseStatus={courseStatus}
                onPreview={onPreview}
                onSave={onSave}
                disablePreview={
                    isEdited ||
                    isSaving
                }
                isSaving={isSaving}
                isPreviewing={isPreviewing}
                locale={locale}
                roles={roles}
                slug={slug}
            />
            <Tabs.Root defaultTab={TabTypes.General} onValueChange={onTabChange}>
                <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
                    <Tabs.Trigger
                        value={TabTypes.General}
                        disabled={isSaving || isPreviewing}
                        isLast={false}
                    >
                        {editCourseTranslations('generalTab')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={TabTypes.IntroOutline}
                        disabled={isSaving || isPreviewing}
                        isLast={false}
                        >
                        {editCourseTranslations('introOutlineTab')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={TabTypes.CourseContent}
                        disabled={isSaving || isPreviewing}
                        isLast={!roles.includes('superadmin')}
                    >
                        {editCourseTranslations('courseContent')}
                    </Tabs.Trigger>
                    {roles.includes('superadmin') && (
                        <Tabs.Trigger
                            value={TabTypes.AdminDetails}
                            disabled={isSaving || isPreviewing}
                            isLast={true}
                        >
                            {editCourseTranslations('adminDetailsTab')}
                        </Tabs.Trigger>
                    )}
                </Tabs.List>
                {successMessage && (
                    <Banner
                        style="success"
                        title={successMessage}
                        closeable
                        onClose={noOp}
                        className={tabContentClass}
                    />
                )}
                {errorMessage && (
                    <Banner
                        style="error"
                        title={editCourseTranslations('errorSaving')}
                        description={errorMessage}
                        closeable
                        onClose={noOp}
                        className={tabContentClass}
                    />
                )}
                {children}
            </Tabs.Root>
        </div>
    );
}

interface EditCourseTabContentProps {
    activeTab: TabTypes;
    slug: string;
    locale: TLocale;
    isPreviewing: boolean;
    isEdited: boolean;
    setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
    courseDetails: CourseDetailsState;
    courseIntroduction: CourseIntroductionForm;
    courseImageUpload: CourseImageUploadState;
    introductionVideoUpload: IntroductionVideoUploadState;
    introductionUploadProgress?: number;
    outlineItems: AccordionBuilderItem[];
    setOutlineItems: React.Dispatch<
        React.SetStateAction<AccordionBuilderItem[]>
    >;
    accordionIconUpload: AccordionIconUploadState;
    accordionUploadProgress?: number;
    modules: CourseModule[];
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
    editWrap: <T extends Array<any>, U>(
        fn: (...args: T) => U,
    ) => (...args: T) => U;
    defaultTab: TabTypes;
    isPublic: boolean;
    setIsPublic: (value: boolean) => void;
    basePrice: number | null;
    setBasePrice: (value: number | null) => void;
    priceIncludingCoachings: number | null;
    setPriceIncludingCoachings: (value: number | null) => void;
    roles: string[];
    courseStatus?: TCourseStatus;
}

function EditCourseTabContent({
    activeTab,
    courseVersion,
    slug,
    locale,
    isPreviewing,
    isEdited,
    setIsEdited,
    courseDetails,
    courseImageUpload,
    modules,
    setModules,
    setCourseVersion,
    courseIntroduction,
    editWrap,
    introductionVideoUpload,
    introductionUploadProgress,
    outlineItems,
    setOutlineItems,
    accordionIconUpload,
    accordionUploadProgress,
    defaultTab,
    isPublic,
    setIsPublic,
    basePrice,
    setBasePrice,
    priceIncludingCoachings,
    setPriceIncludingCoachings,
    roles,
    courseStatus,
}: EditCourseTabContentProps) {
    const tabContentClass = 'mt-5';
    const editCourseTranslations = useTranslations('pages.editCourse');

    const { setActiveTab } = useTabContext();

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    return (
        <>
            <Tabs.Content value={TabTypes.General} className={tabContentClass}>
                {isPreviewing && <EditCourseGeneralPreview slug={slug} />}
                {!isPreviewing && (
                    <Suspense fallback={<DefaultLoading locale={locale} variant='minimal'/>}>
                        <EditCourseGeneral
                            courseVersion={courseVersion}
                            setCourseVersion={setCourseVersion}
                            setIsEdited={setIsEdited}
                            slug={slug}
                            courseForm={{
                                ...courseDetails,
                                setCourseTitle: editWrap(
                                    courseDetails.setCourseTitle,
                                ),
                                setCourseDescription: editWrap(
                                    courseDetails.setCourseDescription,
                                ),
                                setDuration: editWrap(
                                    courseDetails.setDuration,
                                ),
                                setCategoryId: editWrap(
                                    courseDetails.setCategoryId,
                                ),
                                setTopicIds: editWrap(
                                    courseDetails.setTopicIds,
                                ),
                            }}
                            uploadImage={{
                                ...courseImageUpload,
                                handleDelete: editWrap(
                                    courseImageUpload.handleDelete,
                                ),
                            }}
                        />
                    </Suspense>
                )}
            </Tabs.Content>
            <Tabs.Content
                value={TabTypes.IntroOutline}
                className={tabContentClass}
            >
                {isPreviewing && <CourseIntroOutlinePreview slug={slug} />}
                {!isPreviewing && (
                    <Suspense fallback={<DefaultLoading locale={locale} variant='minimal'/>}>
                        <EditCourseIntroOutline
                            slug={slug}
                            courseVersion={courseVersion}
                            setCourseVersion={setCourseVersion}
                            courseIntroduction={{
                                ...courseIntroduction,
                                setIntroductionText: editWrap(
                                    courseIntroduction.setIntroductionText,
                                ),
                            }}
                            introductionVideoUpload={{
                                ...introductionVideoUpload,
                                handleUploadComplete: editWrap(
                                    introductionVideoUpload.handleUploadComplete,
                                ),
                                handleDelete: editWrap(
                                    introductionVideoUpload.handleDelete,
                                ),
                            }}
                            introductionUploadProgress={introductionUploadProgress}
                            outlineItems={outlineItems}
                            setOutlineItems={editWrap(setOutlineItems)}
                            accordionIconUpload={accordionIconUpload}
                            accordionUploadProgress={accordionUploadProgress}
                            setIsEdited={setIsEdited}
                        />
                    </Suspense>
                )}
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
                            courseStatus={courseStatus}
                        />
                    </Suspense>
                )}
            </Tabs.Content>
            {roles.includes('superadmin') && (
                <Tabs.Content
                    value={TabTypes.AdminDetails}
                    className={tabContentClass}
                >
                    {!isPreviewing && (
                        <Suspense fallback={<DefaultLoading locale={locale} variant='minimal'/>}>
                            <EditCourseAdminDetails
                                slug={slug}
                                courseVersion={courseVersion}
                                setCourseVersion={setCourseVersion}
                                isPublic={isPublic}
                                setIsPublic={editWrap(setIsPublic)}
                                basePrice={basePrice}
                                setBasePrice={editWrap(setBasePrice)}
                                priceIncludingCoachings={priceIncludingCoachings}
                                setPriceIncludingCoachings={editWrap(setPriceIncludingCoachings)}
                                setIsEdited={setIsEdited}
                            />
                        </Suspense>
                    )}
                </Tabs.Content>
            )}
        </>
    );
}