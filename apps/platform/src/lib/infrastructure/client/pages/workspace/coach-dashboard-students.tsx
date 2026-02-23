'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    YourStudentCard,
    YourStudentCardList,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCoachStudentsPresenter } from '../../hooks/use-list-coach-students-presenter';
import { useTranslations } from 'next-intl';

// Define the CourseAssignment type based on the UI kit's definition
interface DefaultCourseAssignment {
    courseName: string;
    courseImageUrl: string;
    onClickCourse: () => void;
}

interface NoAssignmentCourse extends DefaultCourseAssignment {
    status: 'no-assignment';
}

interface LongWaitCourseAssignment extends DefaultCourseAssignment {
    status: 'long-wait';
    assignmentTitle: string;
    onViewAssignment: () => void;
}

interface WaitingFeedbackCourseAssignment extends DefaultCourseAssignment {
    status: 'waiting-feedback';
    assignmentTitle: string;
    onViewAssignment: () => void;
}

interface CourseCompletedCourseAssignment extends DefaultCourseAssignment {
    status: 'passed';
    completedCourseDate: Date;
}

type CourseAssignment =
    | NoAssignmentCourse
    | LongWaitCourseAssignment
    | WaitingFeedbackCourseAssignment
    | CourseCompletedCourseAssignment;

function mapAssignmentStatusToCourseStatus(
    status: string | null,
): CourseAssignment['status'] {
    switch (status) {
        case 'Passed':
            return 'passed';
        case 'AwaitingReview':
            return 'waiting-feedback';
        case 'AwaitingForLongTime':
            return 'long-wait';
        default:
            return 'no-assignment';
    }
}

export default function CoachDashboardStudents() {
    const router = useRouter();
    const locale = useLocale() as TLocale;

    const [studentsResponse] = trpc.listCoachStudents.useSuspenseQuery({
        pagination: {
            page: 1,
            pageSize: 8,
        },
    });

    const [studentsViewModel, setStudentsViewModel] = useState<
        viewModels.TListCoachStudentsViewModel | undefined
    >(undefined);

    const { presenter } = useListCoachStudentsPresenter(setStudentsViewModel);

    useEffect(() => {
        if (studentsResponse) {
            // @ts-ignore
            presenter.present(studentsResponse, studentsViewModel);
        }
    }, [studentsResponse, presenter]);

    const handleViewAllStudents = useCallback(() => {
        router.push(`/${locale}/workspace/students`);
    }, [router, locale]);

    const t = useTranslations('pages.coachDashboardStudents');

    const students =
        studentsViewModel?.mode === 'default'
            ? studentsViewModel.data.students
            : [];
    const hasStudents = students.length > 0;
    const hasError = studentsViewModel?.mode === 'kaboom';

    if (hasError) {
        return (
            <div className="flex flex-col space-y-4 pb-15">
                <div className="flex items-center justify-between">
                    <h3> {t('title')} </h3>
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleViewAllStudents}
                        text={t('viewAllStudents')}
                    />
                </div>
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                    <p className="text-red-500">
                        {' '}
                        {t('errorLoadingStudents')}{' '}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-lg pb-15">
            <div className="flex items-center justify-between mb-6">
                <h3> {t('title')} </h3>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleViewAllStudents}
                    text={t('viewAllStudents')}
                />
            </div>

            {hasStudents ? (
                <YourStudentCardList locale={locale}>
                    {students.map((student) => {
                        const courses: CourseAssignment[] = student.courses.map(
                            (course) => {
                                let completedCourseDate: Date | undefined;
                                let status = 'no-assignment';
                                let assignmentTitle: string | undefined;

                                if (course.longestAwaitAssignment) {
                                    status = mapAssignmentStatusToCourseStatus(
                                        course.longestAwaitAssignment.status,
                                    );
                                    assignmentTitle =
                                        course.longestAwaitAssignment.title;
                                }

                                if (course.courseCompletionDate) {
                                    completedCourseDate = new Date(
                                        course.courseCompletionDate,
                                    );
                                }

                                if (!course.longestAwaitAssignment) {
                                    return {
                                        courseName: course.title,
                                        courseImageUrl: course.imageUrl || '',
                                        onClickCourse: () => {
                                            router.push(
                                                `/${locale}/courses/${course.slug || ''}`,
                                            );
                                        },
                                        status: 'no-assignment' as const,
                                    };
                                }

                                if (completedCourseDate) {
                                    return {
                                        courseName: course.title,
                                        courseImageUrl: course.imageUrl || '',
                                        onClickCourse: () => {
                                            router.push(
                                                `/${locale}/courses/${course.slug || ''}`,
                                            );
                                        },
                                        status: 'passed' as const,
                                        completedCourseDate:
                                            completedCourseDate,
                                    };
                                }

                                return {
                                    courseName: course.title,
                                    courseImageUrl: course.imageUrl || '',
                                    onClickCourse: () => {
                                        router.push(
                                            `/${locale}/courses/${course.slug || ''}`,
                                        );
                                    },
                                    status: status,
                                    assignmentTitle: assignmentTitle!,
                                    onViewAssignment: () => {
                                        router.push(`/${locale}/students/${student.username}?tab=assignments`);
                                    },
                                } as CourseAssignment;
                            },
                        );

                        return (
                            <YourStudentCard
                                key={student.id}
                                locale={locale}
                                studentName={student.username}
                                studentImageUrl={student.avatarUrl || ''}
                                coachingSessionsLeft={
                                    student.coachingSessionCount > 0
                                        ? student.coachingSessionCount
                                        : undefined
                                }
                                onStudentDetails={() => {
                                    router.push(
                                        `/${locale}/students/${student.username}`,
                                    );
                                }}
                                courses={courses}
                            />
                        );
                    })}
                </YourStudentCardList>
            ) : (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                    <p className="text-text-secondary text-md">
                        {t('emptyState')}
                    </p>
                </div>
            )}
        </div>
    );
}
