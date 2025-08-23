'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    IconEyeShow,
    IconSave,
    PageTitle,
    DefaultError,
    DefaultLoading,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { Suspense, useState } from 'react';
import EditCourseStructure from './edit-course-structure';
import { useSaveStructure } from './hooks/save-hooks';
import EditHeader from './components/edit-header';

interface EditCourseProps {
    slug: string;
}

enum TabTypes {
    General = 'general',
    IntroOutline = 'intro-outline',
    CourseContent = 'course-content',
}

// TODO: Translate
export default function EditCourse({ slug }: EditCourseProps) {
    const tabContentClass = 'mt-5';
    const locale = useLocale() as TLocale;

    const [isEdited, setIsEdited] = useState(false);
    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.General);

    const [courseVersion, setCourseVersion] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setCourseVersion(null);
        setModules([]);
        setActiveTab(value as TabTypes);
        setErrorMessage(null);
    };

    const handlePreview = () => {
        // TODO: Implement preview functionality
        console.log('Preview clicked for course:', slug);
    };

    const handleSave = async () => {
        if (activeTab === TabTypes.CourseContent) {
            const result = await saveCourseStructure();
            if (result) {
                setIsEdited(false);
            }
            return;
        }
    };

    return (
        <div className="flex flex-col gap-4 px-15">
            <EditHeader
                title="Edit course"
                onPreview={handlePreview}
                onSave={handleSave}
                disablePreview={isEdited || isSavingCourseStructure}
                isSaving={isSavingCourseStructure}
            />
            <Tabs.Root
                defaultTab={TabTypes.General}
                onValueChange={handleTabChange}
            >
                <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
                    <Tabs.Trigger value={TabTypes.General} isLast={false}>
                        General
                    </Tabs.Trigger>
                    <Tabs.Trigger value={TabTypes.IntroOutline} isLast={false}>
                        Intro & Outline
                    </Tabs.Trigger>
                    <Tabs.Trigger value={TabTypes.CourseContent} isLast={true}>
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
                    <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                        <DefaultError
                            locale={locale}
                            title="Not implemented yet"
                            description="This feature is not implemented yet."
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content
                    value={TabTypes.IntroOutline}
                    className={tabContentClass}
                >
                    <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
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
                    <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                        <EditCourseStructure
                            slug={slug}
                            isEdited={isEdited}
                            setIsEdited={setIsEdited}
                            modules={modules}
                            setModules={setModules}
                            setCourseVersion={setCourseVersion}
                        />
                    </Suspense>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
