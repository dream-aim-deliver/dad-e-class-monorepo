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
    status: 'course-completed';
    completedCourseDate: Date;
}

type CourseAssignment =
    | NoAssignmentCourse
    | LongWaitCourseAssignment
    | WaitingFeedbackCourseAssignment
    | CourseCompletedCourseAssignment;

function mapAssignmentStatusToCourseStatus(
    status: string,
): CourseAssignment['status'] {
    switch (status) {
        case 'Passed':
            return 'course-completed';
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

    const {
        data: studentsResponse,
        isLoading,
        error,
    } = trpc.listCoachStudents.useQuery({
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
    }, [studentsResponse, presenter, studentsViewModel]);

    const handleViewAllStudents = useCallback(() => {
        router.push(`/${locale}/workspace/students`);
    }, [router, locale]);

    const t = useTranslations('pages.coachDashboardStudents');

    const students =
        studentsViewModel?.mode === 'default'
            ? studentsViewModel.data.students
            : [];
    const hasStudents = students.length > 0;
    const hasError = error || studentsViewModel?.mode === 'kaboom';

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-4 pb-15">
                <div className="flex items-center">
                    <h3> {t('title')} </h3>
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleViewAllStudents}
                        text={t('viewAllStudents')}
                    />
                </div>
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-64 bg-neutral-800 border border-neutral-700 rounded-medium"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex flex-col space-y-4 pb-15">
                <div className="flex items-center">
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
            <div className="flex items-center mb-6">
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

                                if (course.lastAssignment) {
                                    status = mapAssignmentStatusToCourseStatus(
                                        course.lastAssignment.status,
                                    );
                                    assignmentTitle =
                                        course.lastAssignment.title;
                                }

                                if (course.courseCompletionDate) {
                                    completedCourseDate = new Date(
                                        course.courseCompletionDate,
                                    );
                                }

                                if (!course.lastAssignment) {
                                    return {
                                        courseName: course.title,
                                        courseImageUrl: course.imageUrl || '',
                                        onClickCourse: () => {
                                            router.push(
                                                `/${locale}/course/${course.slug || ''}`,
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
                                                `/${locale}/course/${course.slug || ''}`,
                                            );
                                        },
                                        status: 'course-completed' as const,
                                        completedCourseDate:
                                            completedCourseDate,
                                    };
                                }

                                return {
                                    courseName: course.title,
                                    courseImageUrl: course.imageUrl || '',
                                    onClickCourse: () => {
                                        router.push(
                                            `/${locale}/course/${course.slug || ''}`,
                                        );
                                    },
                                    status: status,
                                    assignmentTitle: assignmentTitle!,
                                    onViewAssignment: () => {
                                        // TODO: Navigate to assignment
                                    },
                                } as CourseAssignment;
                            },
                        );

                        return (
                            <YourStudentCard
                                key={student.id}
                                locale={locale}
                                studentName={`${student.name} ${student.surname}`}
                                studentImageUrl={student.avatarUrl || ''}
                                coachingSessionsLeft={
                                    student.coachingSessionCount > 0
                                        ? student.coachingSessionCount
                                        : undefined
                                }
                                onStudentDetails={() => {
                                    router.push(
                                        `/${locale}/workspace/student/${student.id}`,
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
