import { TLocale } from "@maany_shr/e-class-translations";
import { Button, DefaultError, DefaultLoading, SearchInput, StudentCard, StudentCardList, StudentCardListSkeleton, Tabs } from "@maany_shr/e-class-ui-kit";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../../../trpc/cms-client";
import { coachingOffer, viewModels } from "@maany_shr/e-class-models";
import { useListCourseStudentsPresenter } from "../../../hooks/use-list-course-students-presenter";
import CMSTRPCClientProviders from "../../../trpc/cms-client-provider";
import { StudentCardProps } from "packages/ui-kit/lib/components/student-card/student-card";
import useClientSidePagination from "../../../utils/use-client-side-pagination";

interface EnrolledCourseStudentsProps {
    currentRole: string;
    courseSlug: string;
}

export function CourseStudents(
    props: EnrolledCourseStudentsProps
) {
    const { courseSlug } = props;
    const locale = useLocale() as TLocale;
    const router = useRouter();

    // Search state
    const [filteredAllStudents, setFilteredAllStudents] = useState<viewModels.TListCourseStudentsSuccess['students']>([]);
    const [filteredYourStudents, setFilteredYourStudents] = useState<viewModels.TListCourseStudentsSuccess['students']>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all-students');

    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    const courseStudentsTranslations = useTranslations(
        'pages.course.students',
    );

    const [courseStudentsResponse] = trpc.listCourseStudents.useSuspenseQuery({
        courseSlug,
    });

    const [courseStudentsListViewModel, setCourseStudentsListViewModel] = useState<
        viewModels.TListCourseStudentsViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseStudentsPresenter(
        setCourseStudentsListViewModel,
    );

    // @ts-ignore
    presenter.present(courseStudentsResponse, courseStudentsListViewModel);

    // Get all students from the view model
    const allStudents = useMemo(() => {
        if (!courseStudentsListViewModel || courseStudentsListViewModel.mode !== 'default') {
            return [];
        }
        return courseStudentsListViewModel.data.students;
    }, [courseStudentsListViewModel]);

    // Filter for "your students" tab
    const yourStudents = useMemo(() => {
        return allStudents.filter(student => student.isStudentOfCoach);
    }, [allStudents]);

    // Update filtered students whenever search results change or data changes
    useEffect(() => {
        // If no active search, show all students
        if (searchQuery.trim() === '') {
            setFilteredAllStudents(allStudents);
            setFilteredYourStudents(yourStudents);
        }
        // If there's an active search, the SearchInput will handle updating filtered results
    }, [allStudents, yourStudents, searchQuery]);

    // Pagination for all students (use filtered results)
    const {
        displayedItems: displayedAllStudents,
        hasMoreItems: hasMoreAllStudents,
        handleLoadMore: handleLoadMoreAllStudents,
    } = useClientSidePagination({
        items: filteredAllStudents,
    });

    // Pagination for your students (use filtered results)
    const {
        displayedItems: displayedYourStudents,
        hasMoreItems: hasMoreYourStudents,
        handleLoadMore: handleLoadMoreYourStudents,
    } = useClientSidePagination({
        items: filteredYourStudents,
    });

    if (!courseStudentsListViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseStudentsListViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    // Helper to render content based on students and search state
    const renderStudentContent = (students: viewModels.TListCourseStudentsSuccess['students'], displayedStudents: viewModels.TListCourseStudentsSuccess['students'], hasMore: boolean, handleLoadMore: () => void) => {
        // If there's a search query and no results, show "No students found"
        if (searchQuery.trim() !== '' && students.length === 0) {
            return (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem] animate-pulse">
                    <p className="text-text-primary text-md">
                        {courseStudentsTranslations('noStudentsFound')}
                    </p>
                </div>
            );
        }

        // Otherwise, render the student list (which will show "No students yet" if empty)
        return (
            <>
                <StudentCardList locale={locale}>
                    {renderStudentCards(displayedStudents)}
                </StudentCardList>
                {hasMore && (
                    <div className="flex justify-center items-center w-full mt-6">
                        <Button
                            variant="text"
                            text={paginationTranslations('loadMore')}
                            onClick={handleLoadMore}
                        />
                    </div>
                )}
            </>
        );
    };

    // Helper to render student cards (extracted to avoid duplication)
    const renderStudentCards = (students: viewModels.TListCourseStudentsSuccess['students']) => {
        return students.map((student, index) => {
            // Determine status based on whether assignment exists and its status
            let status: StudentCardProps["status"] = "no-assignment";
            let assignmentTitle: string | undefined;
            let completedCourseDate: Date | undefined;
            const assignmentStatus = student.lastAssignment?.assignmentStatus;

            // If there's a last assignment, use its status directly
            if (student.lastAssignment) {
                status = assignmentStatus ? assignmentStatus : "no-assignment";
                assignmentTitle = student.lastAssignment.assignmentTitle;
            }
            // If no assignment, status remains "no-assignment"

            // If course is completed, use the completion date from the model
            if (student.courseCompletionDate) {
                completedCourseDate = new Date(student.courseCompletionDate);
            }

            // Check if student has a coach assigned
            const hasCoach = student.lastAssignmentCoach !== null && student.lastAssignmentCoach !== undefined;

            // Handle coach name: use full name if available, otherwise default to username, or empty if no coach
            const coachName = hasCoach
                ? (student.lastAssignmentCoach?.coachFullName && student.lastAssignmentCoach.coachFullName.trim() !== ""
                    ? student.lastAssignmentCoach.coachFullName
                    : student.lastAssignmentCoach?.coachUsername ?? "")
                : "";

            const commonProps = {
                studentName: student.fullName,
                studentImageUrl: student.avatarUrl ?? "",
                coachName: coachName,
                coachImageUrl: hasCoach ? (student.lastAssignmentCoach?.avatarUrl ?? "") : "",
                courseImageUrl: student.courseImageUrl ?? "",
                courseName: student.courseTitle,
                coachingSessionsLeft: hasCoach ? student.lastAssignmentCoach?.coachingSessionCount : undefined,
                isYou: student.isStudentOfCoach,
                onStudentDetails: () => {
                    // Navigate to student profile in a new tab
                    window.open(`/${locale}/students/${student.studentUsername}?courseSlug=${courseSlug}`, '_blank');
                },
                onClickCourse: () => {
                    // Navigate to course page in a new tab
                    window.open(`/${locale}/courses/${student.courseSlug}`, '_blank');
                },
                onClickCoach: () => {
                    if (hasCoach && student.lastAssignmentCoach?.coachUsername) {
                        window.open(`/coaches/${student.lastAssignmentCoach.coachUsername}`, '_blank');
                    }
                },
                locale,
            };

            const key = student.studentId ?? index;

            if (status === "waiting-feedback" || status === "long-wait") {
                return (
                    <StudentCard
                        {...commonProps}
                        key={key}
                        status={status}
                        assignmentTitle={assignmentTitle!}
                        onViewAssignment={() => {
                            // Navigate to student profile where assignment can be reviewed
                            window.open(`/${locale}/students/${student.studentUsername}?courseSlug=${courseSlug}`, '_blank');
                        }}
                    />
                );
            }

            if (completedCourseDate) {
                return <StudentCard {...commonProps} key={key} status="passed" completedCourseDate={completedCourseDate} />;
            }

            // for 'no-assignment' status (when lastAssignment is null)
            return <StudentCard {...commonProps} key={key} status="no-assignment" />;
        });
    };

    return (
        <Tabs.Root defaultTab="all-students" onValueChange={setActiveTab}>
            <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4" >
                <div className="w-full flex gap-4 items-center flex-wrap" >
                    <p className="text-2xl font-semibold text-white" >
                        {courseStudentsTranslations('students')}
                    </p>
                    <Tabs.List className="flex rounded-medium gap-2 w-fit whitespace-nowrap">
                        <Tabs.Trigger value="all-students" isLast={false}>
                            {courseStudentsTranslations('allStudents')}
                        </Tabs.Trigger>
                        <Tabs.Trigger value="your-students" isLast={true}>
                            {courseStudentsTranslations('yourStudents')}
                        </Tabs.Trigger>
                    </Tabs.List>
                </div>

                {/* Search Input */}
                <SearchInput
                    key={`search-${activeTab}`}
                    items={activeTab === 'all-students' ? allStudents : yourStudents}
                    keys={['fullName']}
                    onResults={(results) => {
                        if (activeTab === 'all-students') {
                            setFilteredAllStudents(results);
                        } else {
                            setFilteredYourStudents(results);
                        }
                    }}
                    onLoading={(loading) => {
                        setIsSearchLoading(loading);
                    }}
                    placeholder={courseStudentsTranslations('searchPlaceholder')}
                    onQueryChange={setSearchQuery}
                    className="md:w-fit w-full"
                />
            </div>
            <Tabs.Content value="all-students" className="mt-10">
                {isSearchLoading ? (
                    <StudentCardListSkeleton cardCount={displayedAllStudents.length || 6} />
                ) : (
                    renderStudentContent(filteredAllStudents, displayedAllStudents, hasMoreAllStudents, handleLoadMoreAllStudents)
                )}
            </Tabs.Content>

            <Tabs.Content value="your-students" className="mt-10">
                {isSearchLoading ? (
                    <StudentCardListSkeleton cardCount={displayedYourStudents.length || 6} />
                ) : (
                    renderStudentContent(filteredYourStudents, displayedYourStudents, hasMoreYourStudents, handleLoadMoreYourStudents)
                )}
            </Tabs.Content>
        </Tabs.Root >
    )
}

export default function EnrolledCourseStudents(
    props: EnrolledCourseStudentsProps
) {
    const locale = useLocale() as TLocale;
    const courseTranslations = useTranslations('pages.course');

    if (props.currentRole === 'student' || props.currentRole === 'visitor')
        throw new Error(courseTranslations('completedPanel.accessDeniedError'));
    return (
        <CMSTRPCClientProviders>
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <CourseStudents {...props} />
            </Suspense>
        </CMSTRPCClientProviders>
    )
}