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
import { trpc } from '../../../trpc/cms-client';
import EnrolledCourseStudents from './enrolled-course-students';
// import { trpc as trpcMock } from '../../../trpc/client';

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
            const studentTabs = [
                {
                    icon: <IconInfoCircle />,
                    value: StudentCourseTab.INTRODUCTION,
                    label: courseTranslations('tabs.introduction'),
                },
                {
                    icon: <IconHourglass />,
                    value: StudentCourseTab.STUDY,
                    label: courseTranslations('tabs.study'),
                },
                {
                    icon: <IconAssignment />,
                    value: StudentCourseTab.ASSIGNMENTS,
                    label: courseTranslations('tabs.assignments'),
                },
                {
                    icon: <IconNotes />,
                    value: StudentCourseTab.NOTES,
                    label: courseTranslations('tabs.notes'),
                },
                {
                    icon: <IconLesson />,
                    value: StudentCourseTab.MATERIAL,
                    label: courseTranslations('tabs.material'),
                },
                {
                    icon: <IconLesson />,
                    value: StudentCourseTab.ASSESSMENT,
                    label: courseTranslations('tabs.assessment'),
                },
            ];

            return (
                <>
                    {studentTabs.map((tab, index) => (
                        <Tabs.Trigger
                            key={tab.value}
                            icon={tab.icon}
                            value={tab.value}
                            isLast={index === studentTabs.length - 1}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </>
            );
        } else {
            const coachTabs = [
                {
                    icon: <IconInfoCircle />,
                    value: CoachCourseTab.INTRODUCTION,
                    label: courseTranslations('tabs.introduction'),
                },
                {
                    icon: <IconEyeShow />,
                    value: CoachCourseTab.PREVIEW,
                    label: courseTranslations('tabs.preview'),
                },
                {
                    icon: <IconStudent />,
                    value: CoachCourseTab.STUDENTS,
                    label: courseTranslations('tabs.students'),
                },
                {
                    icon: <IconAssignment />,
                    value: CoachCourseTab.ASSIGNMENTS,
                    label: courseTranslations('tabs.assignments'),
                },
                {
                    icon: <IconCoach />,
                    value: CoachCourseTab.COACHES,
                    label: courseTranslations('tabs.coaches'),
                },
                {
                    icon: <IconGroup />,
                    value: CoachCourseTab.GROUPS,
                    label: courseTranslations('tabs.groups'),
                },
                {
                    icon: <IconLesson />,
                    value: CoachCourseTab.MATERIAL,
                    label: courseTranslations('tabs.material'),
                },
            ];

            return (
                <>
                    {coachTabs.map((tab, index) => (
                        <Tabs.Trigger
                            key={tab.value}
                            icon={tab.icon}
                            value={tab.value}
                            isLast={index === coachTabs.length - 1}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </>
            );
        }
    };

    return (
        <Tabs.List className="flex rounded-medium gap-2">{getTabs()}</Tabs.List>
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
    // @ts-ignore
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
        return <DefaultLoading locale={locale} variant="minimal" />;
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
                <Tabs.Content value={CoachCourseTab.STUDENTS} className={tabContentClass}>
                    <EnrolledCourseStudents
                        currentRole={props.currentRole}
                        courseSlug={props.courseSlug}
                    />
                </Tabs.Content>
                <Tabs.Content value="study" className={tabContentClass}>
                    <EnrolledCoursePreview courseSlug={props.courseSlug} enableSubmit />
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
                    <Suspense
                        fallback={
                            <DefaultLoading locale={locale} variant="minimal" />
                        }
                    >
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
    // const [studentProgressResponse] = trpcMock.getStudentProgress.useSuspenseQuery({
    //     courseSlug: props.courseSlug,
    // });
    // const [studentProgressViewModel, setStudentProgressViewModel] = useState<
    //     viewModels.TStudentProgressViewModel | undefined
    // >(undefined);
    // const { presenter: progressPresenter } = useGetStudentProgressPresenter(
    //     setStudentProgressViewModel,
    // );
    // progressPresenter.present(
    //     studentProgressResponse,
    //     studentProgressViewModel,
    // );

    // const locale = useLocale() as TLocale;

    // if (!studentProgressViewModel) {
    //     return <DefaultLoading locale={locale} variant="minimal" />;
    // }

    // if (studentProgressViewModel.mode !== 'default') {
    //     return <DefaultError locale={locale} />;
    // }

    return (
        <EnrolledCourseContent
            {...props}
            //studentProgressViewModel={studentProgressViewModel}
        />
    );
}

export default function EnrolledCourse(props: EnrolledCourseProps) {
    if (props.currentRole === 'student') {
        return <ProgressEnrolledCourse {...props} />;
    }
    return <EnrolledCourseContent {...props} />;
}
