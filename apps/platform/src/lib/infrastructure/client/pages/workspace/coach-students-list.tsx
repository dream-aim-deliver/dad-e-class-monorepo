'use client';

import { YourStudentCard, YourStudentCardList, Button } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import useClientSidePagination from '../../utils/use-client-side-pagination';

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

interface CoachStudentsListProps {
    students: viewModels.TCoachStudentsSuccess['students'];
    isLoading: boolean;
    error: any;
}

function mapAssignmentStatusToCourseStatus(status: string): CourseAssignment['status'] {
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

function LoadingSkeleton({ locale }: { locale: TLocale }) {
    return (
        <YourStudentCardList locale={locale}>
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full h-64">
                        <div className="flex flex-row items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-full flex-shrink-0"></div>
                            <div className="flex flex-col gap-1 flex-1">
                                <div className="h-4 bg-neutral-800 border border-neutral-700 rounded w-3/4"></div>
                                <div className="h-3 bg-neutral-800 border border-neutral-700 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-16 bg-neutral-800 border border-neutral-700 rounded"></div>
                            <div className="h-16 bg-neutral-800 border border-neutral-700 rounded"></div>
                        </div>
                        <div className="h-8 bg-neutral-800 border border-neutral-700 rounded mt-auto"></div>
                    </div>
                </div>
            ))}
        </YourStudentCardList>
    );
}

function ErrorState({ locale, error }: { locale: TLocale; error: any }) {
    const pageTranslations = useTranslations('pages.coachStudents');
    
    return (
        <div className="text-center py-12">
            <div className="text-red-600 mb-2">{pageTranslations('loadError')}</div>
            <p className="text-gray-500">{pageTranslations('tryAgain')}</p>
        </div>
    );
}

export default function CoachStudentsList({ students, isLoading, error }: CoachStudentsListProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('components.paginationButton');

    const {
        displayedItems: displayedStudents,
        hasMoreItems: hasMoreStudents,
        handleLoadMore,
    } = useClientSidePagination({ items: students || [] });

    if (isLoading) {
        return <LoadingSkeleton locale={locale} />;
    }

    if (error) {
        return <ErrorState locale={locale} error={error} />;
    }

    if (!students || students.length === 0) {
        return <YourStudentCardList locale={locale}>{[]}</YourStudentCardList>;
    }

    const studentCards = displayedStudents.map((student) => {
        const courses: CourseAssignment[] = student.courses.map((course) => {
            let completedCourseDate: Date | undefined;
            
            if (!course.lastAssignment) {
                return {
                    courseName: course.courseTitle,
                    courseImageUrl: course.courseImageUrl || '',
                    onClickCourse: () => {
                        // TODO: Navigate to course
                        console.log(`Navigate to course: ${course.courseSlug}`);
                    },
                    status: 'no-assignment' as const,
                };
            }

            const status = mapAssignmentStatusToCourseStatus(course.lastAssignment.assignmentStatus);
            
            // If course is completed, use the completion date from the model
            if (course.lastAssignment.assignmentStatus === 'Passed') {
                completedCourseDate = new Date(); // TODO: Get actual completion date from backend
            }

            if (completedCourseDate) {
                return {
                    courseName: course.courseTitle,
                    courseImageUrl: course.courseImageUrl || '',
                    onClickCourse: () => {
                        console.log(`Navigate to course: ${course.courseSlug}`);
                    },
                    status: 'course-completed' as const,
                    completedCourseDate: completedCourseDate,
                };
            }

            return {
                courseName: course.courseTitle,
                courseImageUrl: course.courseImageUrl || '',
                onClickCourse: () => {
                    console.log(`Navigate to course: ${course.courseSlug}`);
                },
                status: status,
                assignmentTitle: course.lastAssignment.assignmentTitle,
                onViewAssignment: () => {
                    // TODO: Navigate to assignment
                    console.log(`View assignment: ${course.lastAssignment!.assignmentId}`);
                },
            } as CourseAssignment;
        });

        return (
            <YourStudentCard
                key={student.studentId}
                locale={locale}
                studentName={student.fullName}
                studentImageUrl={student.avatarUrl || ''}
                coachingSessionsLeft={student.coachingSessionCount > 0 ? student.coachingSessionCount : undefined}
                onStudentDetails={() => {
                    // TODO: Navigate to student details
                    console.log(`View student details: ${student.studentId}`);
                }}
                courses={courses}
            />
        );
    });

    return (
        <div className="flex flex-col space-y-5">
            <YourStudentCardList locale={locale}>{studentCards}</YourStudentCardList>
            {hasMoreStudents && (
                <Button
                    variant="text"
                    text={t('loadMore')}
                    onClick={handleLoadMore}
                />
            )}
        </div>
    );
}
