/**
 * CourseAssignmentsList Component
 *
 * Reusable component for displaying assignment cards in different contexts:
 * - Student course view: shows student's own assignments for the course
 * - Coach student profile view: shows specific student's assignments
 *
 * Features:
 * - Filtering and sorting capabilities
 * - Assignment overview cards with "View" buttons
 * - Modal for viewing full assignment details
 * - Empty, loading, and error states
 * - Responsive design
 */

import React, { Suspense, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import {
    AssignmentOverview,
    AssignmentOverviewList,
    AssignmentCardFilterModal,
    Button,
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    DialogTrigger,
    downloadFile,
    Dropdown,
    IconFilter,
} from '@maany_shr/e-class-ui-kit';
import { useStudentAssignmentFilters } from '../../hooks/use-student-assignment-filters';
import useClientSidePagination from '../../../utils/use-client-side-pagination';
import AssignmentContent from '../enrolled-course/assignment-content';

interface CourseAssignmentsListProps {
    courseSlug: string;
    studentUsername?: string; // If provided, filter to this student (for coach view)
    role: 'student' | 'coach';
}

/**
 * Wrapper component that handles empty courseSlug state before rendering the main component.
 * This prevents React hooks errors by ensuring hooks are only called when component is mounted.
 */
export function CourseAssignmentsList({
    courseSlug,
    studentUsername,
    role,
}: CourseAssignmentsListProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.groupWorkspaceCoach');

    // Show "select a course" message if no course is selected
    if (!courseSlug || courseSlug === '') {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-text-secondary text-lg text-center">
                    {t('assignments.selectCoursePrompt')}
                </p>
            </div>
        );
    }

    // Render the actual content component only when we have a valid courseSlug
    return (
        <CourseAssignmentsListContent
            courseSlug={courseSlug}
            studentUsername={studentUsername}
            role={role}
        />
    );
}

/**
 * Internal component that handles the actual assignments list rendering.
 * Assumes courseSlug is always valid (non-empty).
 */
function CourseAssignmentsListContent({
    courseSlug,
    studentUsername,
    role,
}: CourseAssignmentsListProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const t = useTranslations('pages.groupWorkspaceCoach');
    const paginationTranslations = useTranslations('components.paginationButton');

    // Determine request type based on role
    const requestType = role === 'coach' ? 'requestForCoach' : 'requestForStudent';

    // Use student assignment filters hook
    const {
        filters,
        sortBy,
        showFilterModal,
        assignmentsViewModel,
        isLoading,
        sortedAndFilteredAssignments: assignments,
        availableStatuses,
        availableModules,
        availableLessons,
        handleApplyFilters,
        handleSortChange,
        handleOpenFilterModal,
        handleCloseFilterModal,
        resetFilters,
    } = useStudentAssignmentFilters({
        courseSlug,
        requestType,
        studentUsername,
    });

    // Pagination
    const {
        displayedItems: displayedAssignments,
        hasMoreItems: hasMoreAssignments,
        handleLoadMore: handleLoadMoreAssignments,
    } = useClientSidePagination({
        items: assignments,
        itemsPerPage: 10,
    });

    // Sort options (no 'student' option since we're viewing one student's assignments)
    const sortOptions = [
        { value: 'title', label: t('assignments.sortOptions.title') },
        { value: 'status', label: t('assignments.sortOptions.status') },
        { value: 'date', label: t('assignments.sortOptions.date') },
    ];

    // State for assignment modal
    const [selectedAssignment, setSelectedAssignment] = useState<{
        id: string;
        studentUsername?: string;
    } | null>(null);

    // Loading state
    if (isLoading) {
        return <DefaultLoading locale={locale} />;
    }

    // Error state (kaboom only - not-found means no assignments which is fine)
    if (assignmentsViewModel?.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Empty state (includes not-found from backend)
    if (assignmentsViewModel?.mode === 'not-found' || assignments.length === 0) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                <p className="text-text-primary text-md">
                    {t('assignments.noAssignmentsFound')}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                {/* Header with sort and filter controls */}
                <div className="flex items-center justify-between w-full flex-wrap gap-4">
                    <h3 className="text-text-primary md:text-2xl text-xl font-bold leading-[110%]">
                        {t('assignments.title')}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-text-primary">
                                {t('assignments.sortBy')}
                            </p>
                            <div className="w-48">
                                <Dropdown
                                    type="simple"
                                    options={sortOptions}
                                    onSelectionChange={handleSortChange}
                                    defaultValue={sortBy}
                                    text={{ simpleText: t('assignments.selectSort') }}
                                />
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            size="medium"
                            text={t('assignments.filterButton')}
                            onClick={handleOpenFilterModal}
                            hasIconLeft
                            iconLeft={<IconFilter />}
                            className="w-auto"
                        />
                    </div>
                </div>

                {/* Assignment list */}
                <AssignmentOverviewList locale={locale}>
                    {displayedAssignments.map((assignment) =>
                        role === 'coach' ? (
                            <AssignmentOverview
                                key={assignment.id}
                                {...assignment}
                                locale={locale}
                                role="coach"
                                onClickCourse={() => {
                                    const courseUrl = `/${locale}/course/${assignment.course.slug}`;
                                    window.open(courseUrl, '_blank', 'noopener,noreferrer');
                                }}
                                onClickUser={() => {
                                    if (assignment.student?.username) {
                                        const userUrl = `/${locale}/student/${assignment.student.username}`;
                                        window.open(userUrl, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                onClickView={() => {
                                    setSelectedAssignment({
                                        id: assignment.id,
                                        studentUsername: assignment.student?.username,
                                    });
                                }}
                                onClickGroup={() => {
                                    if (assignment.groupId) {
                                        const groupUrl = `/${locale}/workspace/courses/${assignment.course.slug}/groups/${assignment.groupId}`;
                                        window.open(groupUrl, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                onFileDownload={(url, name) => downloadFile(url, name)}
                            />
                        ) : (
                            <AssignmentOverview
                                key={assignment.id}
                                {...(assignment as any)}
                                role="student"
                                isReplied={true as any}
                                locale={locale}
                                onClickCourse={() => {
                                    const courseUrl = `/${locale}/course/${assignment.course.slug}`;
                                    window.open(courseUrl, '_blank', 'noopener,noreferrer');
                                }}
                                onClickView={() => {
                                    setSelectedAssignment({
                                        id: assignment.id,
                                        studentUsername: assignment.student?.username,
                                    });
                                }}
                                onClickGroup={() => {
                                    if (assignment.groupId) {
                                        const groupUrl = `/${locale}/workspace/courses/${assignment.course.slug}/groups/${assignment.groupId}`;
                                        window.open(groupUrl, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                onFileDownload={(url, name) => downloadFile(url, name)}
                            />
                        )
                    )}
                </AssignmentOverviewList>

                {/* Load more button */}
                {hasMoreAssignments && (
                    <div className="flex justify-center items-center w-full mt-6">
                        <Button
                            variant="text"
                            text={paginationTranslations('loadMore')}
                            onClick={handleLoadMoreAssignments}
                        />
                    </div>
                )}
            </div>

            {/* Assignment Filter Modal */}
            {showFilterModal && (
                <AssignmentCardFilterModal
                    onApplyFilters={handleApplyFilters}
                    onClose={handleCloseFilterModal}
                    initialFilters={filters}
                    availableStatuses={availableStatuses}
                    availableCourses={[]} // No course filter needed - already filtered by course
                    availableModules={availableModules}
                    availableLessons={availableLessons}
                    locale={locale}
                />
            )}

            {/* Assignment View Modal */}
            {selectedAssignment && (
                <Dialog
                    open={!!selectedAssignment}
                    defaultOpen={false}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedAssignment(null);
                        }
                    }}
                >
                    <DialogContent
                        showCloseButton
                        closeOnOverlayClick
                        closeOnEscape
                    >
                        <Suspense fallback={<DefaultLoading locale={locale} />}>
                            <AssignmentContent
                                assignmentId={selectedAssignment.id}
                                studentUsername={selectedAssignment.studentUsername}
                            />
                        </Suspense>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
