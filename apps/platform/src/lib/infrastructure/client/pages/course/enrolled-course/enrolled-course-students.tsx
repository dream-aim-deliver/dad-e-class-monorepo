import { TLocale } from "@maany_shr/e-class-translations";
import { Button, DefaultError, DefaultLoading, SearchInput, StudentCard, StudentCardList, StudentCardListSkeleton, Tabs } from "@maany_shr/e-class-ui-kit";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useState, useMemo, useEffect } from "react";
import { trpc } from "../../../trpc/client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListCourseStudentsPresenter } from "../../../hooks/use-list-course-students-presenter";
import MockTRPCClientProviders from "../../../trpc/mock-client-providers";
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

    // Search state
    const [filteredAllStudents, setFilteredAllStudents] = useState<viewModels.TCourseStudentsListSuccess['students']>([]);
    const [filteredYourStudents, setFilteredYourStudents] = useState<viewModels.TCourseStudentsListSuccess['students']>([]);
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
        viewModels.TCourseStudentsListViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseStudentsPresenter(
        setCourseStudentsListViewModel,
    );

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

    // Helper to render student cards (extracted to avoid duplication)
    const renderStudentCards = (students: viewModels.TCourseStudentsListSuccess['students']) => {
        return students.map((student, index) => {
            // Determine status based on whether assignment exists and its status
            let status: StudentCardProps["status"] = "no-assignment";
            let assignmentTitle: string | undefined;
            let completedCourseDate: Date | undefined;

            // If there's a last assignment, use its status directly
            if (student.lastAssignment) {
                status = student.lastAssignment.assignmentStatus;
                assignmentTitle = student.lastAssignment.assignmentTitle;
            }
            // If no assignment, status remains "no-assignment"

            // If course is completed, use the completion date from the model
            if (student.courseCompletionDate) {
                completedCourseDate = new Date(student.courseCompletionDate);
            }

            const commonProps = {
                studentName: student.fullName,
                studentImageUrl: student.avatarUrl ?? "",
                coachName: student.lastAssignmentCoach?.coachFullName ?? "",
                coachImageUrl: student.lastAssignmentCoach?.avatarUrl ?? "",
                courseImageUrl: student.courseImageUrl ?? "",
                courseName: student.courseTitle,
                coachingSessionsLeft: student.lastAssignmentCoach?.coachingSessionCount,
                isYou: student.isStudentOfCoach,
                onStudentDetails: () => alert(`Student Details: ${student.fullName}`),
                onClickCourse: () => alert(`Course Clicked: ${student.courseTitle}`),
                onClickCoach: () => alert(`Coach Clicked: ${student.lastAssignmentCoach?.coachFullName || "N/A"}`),
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
                        onViewAssignment={() => alert(`View Assignment: ${assignmentTitle}`)}
                    />
                );
            }

            if (completedCourseDate) {
                return <StudentCard {...commonProps} key={key} status="course-completed" completedCourseDate={completedCourseDate} />;
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
                    <>
                        <StudentCardList locale={locale}>
                            {renderStudentCards(displayedAllStudents)}
                        </StudentCardList>
                        {hasMoreAllStudents && (
                            <div className="flex justify-center items-center w-full mt-6">
                                <Button
                                    variant="text"
                                    text={paginationTranslations('loadMore')}
                                    onClick={handleLoadMoreAllStudents}
                                />
                            </div>
                        )}
                    </>
                )}
            </Tabs.Content>

            <Tabs.Content value="your-students" className="mt-10">
                {isSearchLoading ? (
                    <StudentCardListSkeleton cardCount={displayedYourStudents.length || 6} />
                ) : (
                    <>
                        <StudentCardList locale={locale}>
                            {renderStudentCards(displayedYourStudents)}
                        </StudentCardList>
                        {hasMoreYourStudents && (
                            <div className="flex justify-center items-center w-full mt-6">
                                <Button
                                    variant="text"
                                    text={paginationTranslations('loadMore')}
                                    onClick={handleLoadMoreYourStudents}
                                />
                            </div>
                        )}
                    </>
                )}
            </Tabs.Content>
        </Tabs.Root >
    )
}

export default function EnrolledCourseStudents(
    props: EnrolledCourseStudentsProps
) {
    const locale = useLocale() as TLocale;

    if (props.currentRole === 'student' || props.currentRole === 'visitor')
        throw new Error('Access denied for current role');
    return (
        <MockTRPCClientProviders>
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <CourseStudents {...props} />
            </Suspense>
        </MockTRPCClientProviders>
    )
}