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
import { act, Suspense, useState } from 'react';
import EditCourseContent from './edit-course-content';
import { CourseModule } from './types';

interface EditCoursesProps {
    slug: string;
}

interface EditCourseHeaderProps {
    onPreview: () => void;
    onSave: () => void;
    canPreview: boolean;
}

function EditCourseHeader({
    onPreview,
    onSave,
    canPreview,
}: EditCourseHeaderProps) {
    return (
        <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
            <PageTitle text="Edit course" />
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <Button
                    variant="text"
                    iconLeft={<IconEyeShow />}
                    hasIconLeft
                    text={canPreview ? 'Show Preview' : 'Save to preview'}
                    className="px-0"
                    onClick={onPreview}
                    disabled={!canPreview}
                />
                <Button
                    variant="primary"
                    iconLeft={<IconSave />}
                    hasIconLeft
                    text="Save draft"
                    onClick={onSave}
                />
            </div>
        </div>
    );
}

enum TabTypes {
    General = 'general',
    IntroOutline = 'intro-outline',
    CourseContent = 'course-content',
}

// TODO: Translate
export default function EditCourse({ slug }: EditCoursesProps) {
    const tabContentClass = 'mt-5';
    const locale = useLocale() as TLocale;

    const [isEdited, setIsEdited] = useState(false);
    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.General);

    const [courseVersion, setCourseVersion] = useState<number | null>(null);

    const [modules, setModules] = useState<CourseModule[]>([]);

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
    };

    const handlePreview = () => {
        // TODO: Implement preview functionality
        console.log('Preview clicked for course:', slug);
    };

    const saveCourseStructure = async () => {};

    const handleSave = () => {
        if (activeTab === TabTypes.CourseContent) {
            saveCourseStructure();
            return;
        }
        setIsEdited(false); // Reset edited state after saving
    };

    return (
        <div className="flex flex-col gap-4">
            <EditCourseHeader
                onPreview={handlePreview}
                onSave={handleSave}
                canPreview={!isEdited}
            />
            <Tabs.Root
                defaultTab={TabTypes.General}
                onValueChange={handleTabChange}
            >
                <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
                    <Tabs.Trigger value={TabTypes.General}>
                        General
                    </Tabs.Trigger>
                    <Tabs.Trigger value={TabTypes.IntroOutline}>
                        Intro & Outline
                    </Tabs.Trigger>
                    <Tabs.Trigger value={TabTypes.CourseContent}>
                        Course Content
                    </Tabs.Trigger>
                </Tabs.List>
                <DefaultError
                    locale={locale}
                    className={tabContentClass}
                    title="Error saving the course"
                />
                <Tabs.Content
                    value={TabTypes.General}
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
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <EditCourseContent
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
