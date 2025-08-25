'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';
import {
    AccordionBuilderItem,
    CourseDetailsState,
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
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
import { useSaveDetails } from './hooks/edit-details-hooks';
import { useSaveIntroduction } from './hooks/edit-introduction-hooks';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';
import { useSaveOutline } from './hooks/edit-outline-hooks';
import { AccordionIconUploadState } from './hooks/use-accordion-icon-upload';

interface EditCourseProps {
    slug: string;
    defaultTab?: string;
}

enum TabTypes {
    General = 'general',
    IntroOutline = 'intro-outline',
    CourseContent = 'course-content',
}

export default function EditCourse({ slug, defaultTab }: EditCourseProps) {
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
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <EditCourseContent
            slug={slug}
            course={courseViewModel.data}
            defaultTab={
                Object.values(TabTypes).includes(defaultTab as TabTypes)
                    ? (defaultTab as TabTypes)
                    : TabTypes.General
            }
        />
    );
}

interface EditCourseContentProps {
    slug: string;
    course: viewModels.TEnrolledCourseDetailsSuccess;
    defaultTab: TabTypes;
}

function EditCourseContent({
    slug,
    course,
    defaultTab,
}: EditCourseContentProps) {
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
    } = useEditCourseState(defaultTab);

    const { courseVersion, setCourseVersion, errorMessage, setErrorMessage } =
        useCourseVersionState();

    // General Tab State
    const {
        courseDetails,
        courseImageUpload,
        saveCourseDetails,
        saveDetailsMutation,
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
    } = useSaveIntroduction({
        slug,
        courseVersion,
        setErrorMessage,
    });

    // Outline Tab State
    const {
        outlineItems,
        accordionIconUpload,
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

    const handleSave = async () => {
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
        if (result) {
            setIsEdited(false);
            if (activeTab !== TabTypes.CourseContent) {
                window.location.reload();
            }
        }
    };

    const isSaving =
        isSavingCourseStructure ||
        saveDetailsMutation.isPending ||
        isIntroductionSaving ||
        isOutlineSaving;

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
            defaultTab={defaultTab}
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
                outlineItems={outlineItems}
                setOutlineItems={setOutlineItems}
                accordionIconUpload={accordionIconUpload}
                modules={modules}
                setModules={setModules}
                setCourseVersion={setCourseVersion}
                editWrap={editWrap}
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

    return {
        courseVersion,
        setCourseVersion,
        errorMessage,
        setErrorMessage,
    };
}

interface EditCourseLayoutProps {
    defaultTab: TabTypes;
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
    defaultTab,
}: EditCourseLayoutProps) {
    const tabContentClass = 'mt-5';
    const editCourseTranslations = useTranslations('pages.editCourse');
    return (
        <div className="flex flex-col gap-4 px-15">
            <EditHeader
                title={editCourseTranslations('editCourseTitle')}
                onPreview={onPreview}
                onSave={onSave}
                disablePreview={isEdited || isSaving}
                isSaving={isSaving}
                isPreviewing={isPreviewing}
                locale={locale}
            />
            <Tabs.Root defaultTab={defaultTab} onValueChange={onTabChange}>
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
                        isLast={true}
                    >
                        {editCourseTranslations('courseContent')}
                    </Tabs.Trigger>
                </Tabs.List>
                {errorMessage && (
                    <DefaultError
                        locale={locale}
                        className={tabContentClass}
                        title={editCourseTranslations('errorSaving')}
                        description={errorMessage}
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
    outlineItems: AccordionBuilderItem[];
    setOutlineItems: React.Dispatch<
        React.SetStateAction<AccordionBuilderItem[]>
    >;
    accordionIconUpload: AccordionIconUploadState;
    modules: CourseModule[];
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
    editWrap: <T extends Array<any>, U>(
        fn: (...args: T) => U,
    ) => (...args: T) => U;
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
    outlineItems,
    setOutlineItems,
    accordionIconUpload,
}: EditCourseTabContentProps) {
    const tabContentClass = 'mt-5';
    const editCourseTranslations = useTranslations('pages.editCourse');

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
                            outlineItems={outlineItems}
                            setOutlineItems={setOutlineItems}
                            accordionIconUpload={accordionIconUpload}
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
                        />
                    </Suspense>
                )}
            </Tabs.Content>
        </>
    );
}