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
import { useRouter, useSearchParams } from 'next/navigation';
import { CoachCourseTab, StudentCourseTab } from '../../../utils/course-tabs';
import EnrolledCourseCompletedAssessment from './enrolled-course-completed-assessment';
import EnrolledCoursePreview from './enrolled-course-preview';
import EnrolledCourseMaterial from './enrolled-course-material';
import EnrolledCoaches from './enrolled-coaches';
import { trpc } from '../../../trpc/cms-client';
import EnrolledCourseStudents from './enrolled-course-students';
import EnrolledCourseNotes from './enrolled-course-notes';
import CoachCourseGroups from './coach-course-groups';
import { useGetCourseStatusPresenter } from '../../../hooks/use-get-course-status-presenter';
import { useGetCourseCertificateDataPresenter } from '../../../hooks/use-get-course-certificate-data-presenter';
import CourseCompletion from '../../course-completion';
import { CourseAssignmentsList } from '../components/course-assignments-list';
import { usePlatform } from '../../../context/platform-context';


interface EnrolledCourseProps {
    roles: string[];
    currentRole: string;
    courseSlug: string;
    tab?: string;
    studentUsername?: string;
    lesson?: string;
    isArchived?: boolean;
    showArchivedBadge?: boolean;
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
    const courseT = useTranslations('pages.course');
    const platformContext = usePlatform();
    const supportEmail = platformContext?.platform.supportEmailAddress;
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

    const [courseStatusResponse] = trpc.getCourseStatus.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [courseStatusViewModel, setCourseStatusViewModel] = useState<
        viewModels.TGetCourseStatusViewModel | undefined
    >(undefined);
    const { presenter: courseStatusPresenter } = useGetCourseStatusPresenter(
        setCourseStatusViewModel,
    );
    // @ts-ignore
    courseStatusPresenter.present(courseStatusResponse, courseStatusViewModel);

    // Certificate data fetching for download certificate button
    const [certificateDataResponse] = trpc.getCourseCertificateData.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [certificateDataViewModel, setCertificateDataViewModel] = useState<
        viewModels.TGetCourseCertificateDataViewModel | undefined
    >(undefined);
    const { presenter: certificateDataPresenter } =
        useGetCourseCertificateDataPresenter(setCertificateDataViewModel);
    // @ts-ignore
    certificateDataPresenter.present(certificateDataResponse, certificateDataViewModel);

    const [showCompletionModal, setShowCompletionModal] = useState(false);

    useEffect(() => {
        if (courseStatusViewModel?.mode === 'default' && props.currentRole === 'student') {
            const isCompleted = courseStatusViewModel.data?.courseStatus.status === 'completed';
            if (isCompleted) {
                setShowCompletionModal(true);
            }
        }
    }, [courseStatusViewModel, props.currentRole]);
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (courseViewModel?.mode === 'unauthenticated') {
            router.push('/login');
        }
    }, [courseViewModel, router]);

    const defaultTab: string = useMemo(() => {
        if (props.tab) {
            const studentTabs: string[] = Object.values(StudentCourseTab);
            const coachTabs: string[] = Object.values(CoachCourseTab);
            if (props.currentRole === 'student' && studentTabs.includes(props.tab)) {
                return props.tab;
            }
            if (props.currentRole !== 'student' && coachTabs.includes(props.tab)) {
                return props.tab;
            }
        }
        return props.currentRole === 'student' ? StudentCourseTab.INTRODUCTION : CoachCourseTab.INTRODUCTION;
    }, [props.tab, props.currentRole]);

    // Tab state management - sync with URL
    const [activeTab, setActiveTab] = useState<string>(defaultTab);

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    // Update URL when tab changes
    const handleTabChange = (newTab: string) => {
        setActiveTab(newTab);
        const params = new URLSearchParams(searchParams.toString());
        const currentRole = params.get('role') || props.currentRole;
        
        // Update tab parameter
        params.set('tab', newTab);
        
        // Remove lesson parameter when switching away from study tab
        if (newTab !== StudentCourseTab.STUDY) {
            params.delete('lesson');
        }

        // Remove lesson-material parameter when switching away from material tab
        if (newTab !== 'material') {
            params.delete('lesson-material');
        }
        
        // Preserve role parameter
        if (currentRole) {
            params.set('role', currentRole);
        }
        
        router.push(`/${locale}/courses/${props.courseSlug}?${params.toString()}`);
    };

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
        if (supportEmail && supportEmail.trim() !== '') {
            return (
                <DefaultError
                    type="withSupportEmail"
                    locale={locale}
                    title={courseT('error.title')}
                    description={courseT('error.description')}
                    supportEmailAddress={supportEmail}
                />
            );
        } else {
            return (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={courseT('error.title')}
                    description={courseT('error.description')}
                />
            );
        }
    }

    const tabContentClass = 'mt-10';

    return (
        <div className="flex flex-col space-y-4 overflow-x-hidden">
            <EnrolledCourseHeading
                courseViewModel={courseViewModel}
                courseStatusViewModel={courseStatusViewModel}
                roles={props.roles}
                currentRole={props.currentRole}
                courseSlug={props.courseSlug}
                certificateDataViewModel={certificateDataViewModel}
                isArchived={props.isArchived}
                showArchivedBadge={props.showArchivedBadge}
            />
            <Tabs.Root defaultTab={activeTab} onValueChange={handleTabChange}>
                <CourseTabList role={props.currentRole} />
                <Tabs.Content value="introduction" className={tabContentClass}>
                    <EnrolledCourseIntroduction
                        currentRole={props.currentRole}
                        courseViewModel={courseViewModel}
                        progressViewModel={props.studentProgressViewModel}
                        courseSlug={props.courseSlug}
                        isArchived={props.isArchived}
                    />
                </Tabs.Content>
                <Tabs.Content
                    value={CoachCourseTab.PREVIEW}
                    className={tabContentClass}
                >
                    <EnrolledCoursePreview courseSlug={props.courseSlug} initialLessonId={props.lesson} isArchived={props.isArchived} />
                </Tabs.Content>
                <Tabs.Content value={CoachCourseTab.STUDENTS} className={tabContentClass}>
                    <EnrolledCourseStudents
                        currentRole={props.currentRole}
                        courseSlug={props.courseSlug}
                    />
                </Tabs.Content>
                <Tabs.Content value="study" className={tabContentClass}>
                    <EnrolledCoursePreview
                        courseSlug={props.courseSlug}
                        enableSubmit={!props.isArchived}
                        studentUsername={props.studentUsername}
                        initialLessonId={props.lesson}
                        isArchived={props.isArchived}
                        showArchivedBadge={props.showArchivedBadge}
                        onLessonNavigate={(lessonId) => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('tab', 'study');
                            params.set('lesson', lessonId.toString());
                            const currentRole = params.get('role');
                            if (currentRole) {
                                params.set('role', currentRole);
                            }
                            router.push(`/${locale}/courses/${props.courseSlug}?${params.toString()}`);
                        }}
                    />
                </Tabs.Content>
                <Tabs.Content value="assignments" className={tabContentClass}>
                    <Suspense
                        fallback={
                            <DefaultLoading locale={locale} variant="minimal" />
                        }
                    >
                        <CourseAssignmentsList
                            courseSlug={props.courseSlug}
                            role={props.currentRole === 'student' ? 'student' : 'coach'}
                            studentUsername={props.studentUsername}
                            isArchived={props.isArchived}
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content value={StudentCourseTab.NOTES} className={tabContentClass}>
                    <EnrolledCourseNotes
                        courseSlug={props.courseSlug}
                        currentRole={props.currentRole}
                    />
                </Tabs.Content>
                <Tabs.Content
                    value={CoachCourseTab.COACHES}
                    className={tabContentClass}
                >
                    <Suspense
                        fallback={
                            <DefaultLoading locale={locale} variant="minimal" />
                        }
                    >
                        <EnrolledCoaches
                            courseSlug={props.courseSlug}
                            currentRole={props.currentRole}
                            isArchived={props.isArchived}
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content
                    value={CoachCourseTab.GROUPS}
                    className={tabContentClass}
                >
                    <Suspense
                        fallback={
                            <DefaultLoading locale={locale} variant="minimal" />
                        }
                    >
                        <CoachCourseGroups
                            courseSlug={props.courseSlug}
                            currentRole={props.currentRole}
                        />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content value="material" className={tabContentClass}>
                    <EnrolledCourseMaterial
                        currentRole={props.currentRole}
                        courseSlug={props.courseSlug}
                    />
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
            {showCompletionModal && courseViewModel?.mode === 'default' && (
                <CourseCompletion
                    slug={props.courseSlug}
                    courseImage={courseViewModel.data.imageFile?.downloadUrl || ''}
                    courseTitle={courseViewModel.data.title}
                />
            )}
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
