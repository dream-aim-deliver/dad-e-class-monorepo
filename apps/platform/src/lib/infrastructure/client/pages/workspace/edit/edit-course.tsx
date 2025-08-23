'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    CourseDetailsState,
    CourseIntroductionForm,
    DefaultError,
    DefaultLoading,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import React, { Suspense, useState } from 'react';
import EditCourseStructure from './edit-course-structure';
import { useSaveStructure } from './hooks/save-hooks';
import EditHeader from './components/edit-header';
import EnrolledCoursePreview from '../../course/enrolled-course/enrolled-course-preview';
import EditCourseGeneral, {
    EditCourseGeneralPreview,
} from './edit-course-general';
import { CourseImageUploadState } from '../../common/hooks/use-course-image-upload';
import EditCourseIntroOutline from './edit-course-intro-outline';
import { CourseModule } from './types';
import { useSaveDetails } from './hooks/edit-details-hooks';
import { useSaveIntroduction } from './hooks/edit-introduction-hooks';
import { IntroductionVideoUploadState } from './hooks/use-introduction-video-upload';

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
    const { courseIntroduction, introductionVideoUpload } = useSaveIntroduction(
        {
            slug,
            courseVersion,
            setErrorMessage,
        },
    );

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
}: EditCourseTabContentProps) {
    const tabContentClass = 'mt-5';

    return (
        <>
            <Tabs.Content value={TabTypes.General} className={tabContentClass}>
                {isPreviewing && <EditCourseGeneralPreview slug={slug} />}
                {!isPreviewing && (
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
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
                <Suspense fallback={<DefaultLoading locale={locale} />}>
                    <EditCourseIntroOutline
                        slug={slug}
                        courseVersion={courseVersion}
                        setCourseVersion={setCourseVersion}
                        courseIntroduction={courseIntroduction}
                        introductionVideoUpload={introductionVideoUpload}
                    />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content
                value={TabTypes.CourseContent}
                className={tabContentClass}
            >
                {isPreviewing && <EnrolledCoursePreview courseSlug={slug} />}
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
        </>
    );
}
