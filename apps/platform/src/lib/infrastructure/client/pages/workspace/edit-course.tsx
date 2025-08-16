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
import { Suspense } from 'react';

interface EditCoursesProps {
    slug: string;
}

interface EditCourseHeaderProps {
    onPreview: () => void;
    onSave: () => void;
}

function EditCourseHeader({ onPreview, onSave }: EditCourseHeaderProps) {
    return (
        <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
            <PageTitle text="Edit course" />
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <Button
                    variant="text"
                    iconLeft={<IconEyeShow />}
                    hasIconLeft
                    text="Show Preview (Alt+P)"
                    className="px-0"
                    onClick={onPreview}
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

// TODO: Translate
export default function EditCourse({ slug }: EditCoursesProps) {
    const tabContentClass = 'mt-5';
    const locale = useLocale() as TLocale;

    const handlePreview = () => {
        // TODO: Implement preview functionality
        console.log('Preview clicked for course:', slug);
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Save clicked for course:', slug);
    };

    return (
        <div className="flex flex-col gap-4">
            <EditCourseHeader onPreview={handlePreview} onSave={handleSave} />
            <Tabs.Root defaultTab="general">
                <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
                    <Tabs.Trigger value="general">General</Tabs.Trigger>
                    <Tabs.Trigger value="intro-outline">
                        Intro & Outline
                    </Tabs.Trigger>
                    <Tabs.Trigger value="course-content">
                        Course Content
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="general" className={tabContentClass}>
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <DefaultError
                            locale={locale}
                            title="Not implemented yet"
                            description="This feature is not implemented yet."
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content value="intro-outline" className={tabContentClass}>
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <DefaultError
                            locale={locale}
                            title="Not implemented yet"
                            description="This feature is not implemented yet."
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content
                    value="course-content"
                    className={tabContentClass}
                >
                    <Suspense
                        fallback={<DefaultLoading locale={locale} />}
                    ></Suspense>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
