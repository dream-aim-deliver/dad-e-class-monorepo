'use client';

import {
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    IconAssignment,
    IconCoach,
    IconEyeShow,
    IconGroup,
    IconHourglass,
    IconInfoCircle,
    IconLesson,
    IconNotes,
    IconStudent,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import EnrolledCourseHeading from './enrolled-course-heading';
import EnrolledCourseIntroduction from './enrolled-course-introduction';
import { useGetStudentProgressPresenter } from '../../../hooks/use-student-progress-presenter';
import { useRouter } from 'next/navigation';
import { CoachCourseTab, StudentCourseTab } from '../../../utils/course-tabs';
import EnrolledCourseCompletedAssessment from './enrolled-course-completed-assessment';
import EnrolledCoursePreview from './enrolled-course-preview';

interface EnrolledCourseProps {
    roles: string[];
    currentRole: string;
    courseSlug: string;
    tab?: string;
}

function CourseTabList({ role }: { role: string }) {
    const courseTranslations = useTranslations('pages.course');

    const getTabs = () => {
        if (role === 'student') {
            return (
                <>
                    <Tabs.Trigger
                        icon={<IconInfoCircle />}
                        value={StudentCourseTab.INTRODUCTION}
                    >
                        {courseTranslations('tabs.introduction')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={StudentCourseTab.STUDY}
                        icon={<IconHourglass />}
                    >
                        {courseTranslations('tabs.study')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={StudentCourseTab.ASSIGNMENTS}
                        icon={<IconAssignment />}
                    >
                        {courseTranslations('tabs.assignments')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={StudentCourseTab.NOTES}
                        icon={<IconNotes />}
                    >
                        {courseTranslations('tabs.notes')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={StudentCourseTab.MATERIAL}
                        icon={<IconLesson />}
                    >
                        {courseTranslations('tabs.material')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={StudentCourseTab.ASSESSMENT}
                        icon={<IconLesson />}
                    >
                        {courseTranslations('tabs.assessment')}
                    </Tabs.Trigger>
                </>
            );
        } else {
            return (
                <>
                    <Tabs.Trigger
                        value={CoachCourseTab.INTRODUCTION}
                        icon={<IconInfoCircle />}
                    >
                        {courseTranslations('tabs.introduction')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={CoachCourseTab.PREVIEW}
                        icon={<IconEyeShow />}
                    >
                        {courseTranslations('tabs.preview')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={CoachCourseTab.STUDENTS}
                        icon={<IconStudent />}
                    >
                        {courseTranslations('tabs.students')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={CoachCourseTab.ASSIGNMENTS}
                        icon={<IconAssignment />}
                    >
                        {courseTranslations('tabs.assignments')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={CoachCourseTab.COACHES}
                        icon={<IconCoach />}
                    >
                        {courseTranslations('tabs.coaches')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={CoachCourseTab.GROUPS}
                        icon={<IconGroup />}
                    >
                        {courseTranslations('tabs.groups')}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value={CoachCourseTab.MATERIAL}
                        icon={<IconLesson />}
                    >
                        {courseTranslations('tabs.material')}
                    </Tabs.Trigger>
                </>
            );
        }
    };

    return (
        <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
            {getTabs()}
        </Tabs.List>
    );
}

interface EnrolledCourseContentProps extends EnrolledCourseProps {
    studentProgressViewModel?: viewModels.TStudentProgressViewModel;
}

export function EnrolledCourseContent(props: EnrolledCourseContentProps) {
    const [courseResponse] = trpc.getEnrolledCourseDetails.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [courseViewModel, setCourseViewModel] = useState<
        viewModels.TEnrolledCourseDetailsViewModel | undefined
    >(undefined);
    const { presenter: coursePresenter } =
        useGetEnrolledCourseDetailsPresenter(setCourseViewModel);
    coursePresenter.present(courseResponse, courseViewModel);

    const locale = useLocale() as TLocale;
    const router = useRouter();

    useEffect(() => {
        if (courseViewModel?.mode === 'unauthenticated') {
            router.push('/login');
        }
    }, [courseViewModel, router]);

    const defaultTab: string = useMemo(() => {
        if (props.tab) {
            const studentTabs: string[] = Object.values(StudentCourseTab);
            if (
                props.currentRole === 'student' &&
                studentTabs.includes(props.tab)
            ) {
                return props.tab;
            }
        }
        return StudentCourseTab.INTRODUCTION;
    }, [props.tab]);

    if (!courseViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    // Don't display anything, wait for the redirect from useEffect
    if (courseViewModel.mode === 'unauthenticated') {
        return;
    }

    // If the course is private, a regular user might as well assume that it doesn't exist
    if (
        courseViewModel.mode === 'not-found' ||
        courseViewModel.mode === 'forbidden'
    ) {
        return <DefaultNotFound locale={locale} />;
    }

    if (courseViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const tabContentClass = 'mt-10';

    return (
        <div className="flex flex-col space-y-4">
            <EnrolledCourseHeading
                courseViewModel={courseViewModel}
                studentProgressViewModel={props.studentProgressViewModel}
                roles={props.roles}
                currentRole={props.currentRole}
                courseSlug={props.courseSlug}
            />
            <Tabs.Root defaultTab={defaultTab}>
                <CourseTabList role={props.currentRole} />
                <Tabs.Content value="introduction" className={tabContentClass}>
                    <EnrolledCourseIntroduction
                        currentRole={props.currentRole}
                        courseViewModel={courseViewModel}
                        progressViewModel={props.studentProgressViewModel}
                        courseSlug={props.courseSlug}
                    />
                </Tabs.Content>
                <Tabs.Content
                    value={CoachCourseTab.PREVIEW}
                    className={tabContentClass}
                >
                    <EnrolledCoursePreview courseSlug={props.courseSlug} />
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
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <EnrolledCourseCompletedAssessment
                            courseSlug={props.courseSlug}
                        />
                    </Suspense>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}

export function ProgressEnrolledCourse(props: EnrolledCourseProps) {
    const [studentProgressResponse] = trpc.getStudentProgress.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [studentProgressViewModel, setStudentProgressViewModel] = useState<
        viewModels.TStudentProgressViewModel | undefined
    >(undefined);
    const { presenter: progressPresenter } = useGetStudentProgressPresenter(
        setStudentProgressViewModel,
    );
    progressPresenter.present(
        studentProgressResponse,
        studentProgressViewModel,
    );

    const locale = useLocale() as TLocale;

    if (!studentProgressViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (studentProgressViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <EnrolledCourseContent
            {...props}
            studentProgressViewModel={studentProgressViewModel}
        />
    );
}

export default function EnrolledCourse(props: EnrolledCourseProps) {
    if (props.currentRole === 'student') {
        return <ProgressEnrolledCourse {...props} />;
    }
    return <EnrolledCourseContent {...props} />;
}
