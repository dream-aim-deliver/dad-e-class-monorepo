'use client';

import {
    DefaultError,
    DefaultLoading,
    IconAssignment,
    IconHourglass,
    IconInfoCircle,
    IconLesson,
    IconNotes,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { useState } from 'react';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import EnrolledCourseHeading from './enrolled-course-heading';
import EnrolledCourseIntroduction from './enrolled-course-introduction';

interface EnrolledCourseProps {
    roles: string[];
    highestRole: string;
    courseSlug: string;
}

function CourseTabList() {
    return (
        <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
            <Tabs.Trigger icon={<IconInfoCircle />} value="introduction">
                Intro
            </Tabs.Trigger>
            <Tabs.Trigger value="study" icon={<IconHourglass />}>
                Study
            </Tabs.Trigger>
            <Tabs.Trigger value="assignments" icon={<IconAssignment />}>
                Assignments
            </Tabs.Trigger>
            <Tabs.Trigger value="notes" icon={<IconNotes />}>
                Your notes
            </Tabs.Trigger>
            <Tabs.Trigger value="material" icon={<IconLesson />}>
                Material
            </Tabs.Trigger>
            <Tabs.Trigger value="assessment" icon={<IconLesson />}>
                Pre-Course Form
            </Tabs.Trigger>
        </Tabs.List>
    );
}

export default function EnrolledCourse(props: EnrolledCourseProps) {
    const [currentRole, setCurrentRole] = useState<string>(props.highestRole);

    const [courseResponse] = trpc.getEnrolledCourseDetails.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [courseViewModel, setCourseViewModel] = useState<
        viewModels.TEnrolledCourseDetailsViewModel | undefined
    >(undefined);
    const { presenter } =
        useGetEnrolledCourseDetailsPresenter(setCourseViewModel);
    presenter.present(courseResponse, courseViewModel);

    const locale = useLocale() as TLocale;

    if (!courseViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const tabContentClass = 'mt-10';

    return (
        <div className="flex flex-col space-y-4">
            <EnrolledCourseHeading courseViewModel={courseViewModel} />
            <Tabs.Root defaultTab="introduction">
                <CourseTabList />
                <Tabs.Content value="introduction" className={tabContentClass}>
                    <EnrolledCourseIntroduction
                        courseViewModel={courseViewModel}
                        role={currentRole}
                    />
                </Tabs.Content>
                <Tabs.Content value="study" className={tabContentClass}>
                    <DefaultError locale={locale} />
                </Tabs.Content>
                <Tabs.Content value="assignments" className={tabContentClass}>
                    <DefaultError locale={locale} />
                </Tabs.Content>
                <Tabs.Content value="notes" className={tabContentClass}>
                    <DefaultError locale={locale} />
                </Tabs.Content>
                <Tabs.Content value="material" className={tabContentClass}>
                    <DefaultError locale={locale} />
                </Tabs.Content>
                <Tabs.Content value="assessment" className={tabContentClass}>
                    <DefaultError locale={locale} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
