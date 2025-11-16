/**
 * Custom hook for managing assignment filtering, sorting, and data fetching.
 * 
 * This hook follows the clean code architecture pattern similar to use-group-members:
 * - Encapsulates TRPC query for fetching assignments
 * - Manages presenter logic for transforming response to ViewModel
 * - Handles filtering and sorting logic internally
 * - Provides handlers for filter modal and sort changes
 * - Self-contained with no external data dependencies
 * 
 * @param courseSlug - The course slug identifier
 * @param groupId - The group identifier (required when requestType is 'requestForCoach')
 * @param requestType - Type of request ('requestForCoach' or 'requestForStudent')
 * @param initialFilters - Optional initial filter state
 * 
 * @returns Object containing:
 * - State: filters, sortBy, showFilterModal
 * - ViewModel state: assignmentsViewModel, isLoading
 * - Processed data: sortedAndFilteredAssignments
 * - Filter options: availableStatuses, availableCourses, availableModules, availableLessons
 * - Handlers: handleApplyFilters, handleSortChange, handleOpenFilterModal, handleCloseFilterModal, resetFilters
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListGroupAssignmentsPresenter } from '../../hooks/use-list-group-assignments-presenter';
import { trpc } from '../../trpc/cms-client';

interface AssignmentFilters {
    title?: string;
    status?: string[];
    course?: string;
    module?: string;
    lesson?: string;
    student?: string;
    groupName?: string;
}

interface UseAssignmentFiltersProps {
    courseSlug: string;
    groupId?: number;
    requestType: 'requestForCoach' | 'requestForStudent';
    initialFilters?: AssignmentFilters;
}

type SortByOption = 'title' | 'status' | 'date' | 'student';

export function useAssignmentFilters({
    courseSlug,
    groupId,
    requestType,
    initialFilters = {},
}: UseAssignmentFiltersProps) {
    const [filters, setFilters] = useState<AssignmentFilters>(initialFilters);
    const [sortBy, setSortBy] = useState<SortByOption>('title');
    const [showFilterModal, setShowFilterModal] = useState(false);

    // ViewModel state
    const [assignmentsViewModel, setAssignmentsViewModel] = useState<
        viewModels.TListGroupAssignmentsViewModel | undefined
    >(undefined);

    // Build additional params based on request type
    const additionalParams = useMemo(() => {
        const params: any = { requestType };
        if (requestType === 'requestForCoach' && groupId) {
            params.groupId = groupId;
        }
        return params;
    }, [requestType, groupId]);

    // Fetch group assignments from listGroupAssignments usecase
    const [assignmentsResponse] = trpc.listGroupAssignments.useSuspenseQuery({
        courseSlug: courseSlug,
        additionalParams,
    });

    const { presenter: assignmentsPresenter } =
        useListGroupAssignmentsPresenter(setAssignmentsViewModel);

    // Present the data
    useEffect(() => {
        if (assignmentsResponse) {
            assignmentsPresenter.present(
                // @ts-ignore
                assignmentsResponse,
                assignmentsViewModel,
            );
        }
    }, [assignmentsResponse]);

    // Extract assignments from ViewModel
    const assignments = useMemo(() => {
        if (
            assignmentsViewModel?.mode === 'default' &&
            assignmentsViewModel.data
        ) {
            return assignmentsViewModel.data.assignments;
        }
        return [];
    }, [assignmentsViewModel]);

    // Filter logic
    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) => {
            // Title filter
            if (
                filters.title &&
                assignment.title &&
                !assignment.title
                    .toLowerCase()
                    .includes(filters.title.toLowerCase())
            ) {
                return false;
            }

            // Status filter
            if (
                filters.status &&
                filters.status.length > 0 &&
                assignment.status &&
                !filters.status.includes(assignment.status)
            ) {
                return false;
            }

            // Course filter
            if (
                filters.course &&
                assignment.course?.title &&
                !assignment.course.title
                    .toLowerCase()
                    .includes(filters.course.toLowerCase())
            ) {
                return false;
            }

            // Module filter
            if (
                filters.module &&
                assignment.module != null &&
                !assignment.module
                    .toString()
                    .toLowerCase()
                    .includes(filters.module.toLowerCase())
            ) {
                return false;
            }

            // Lesson filter
            if (
                filters.lesson &&
                assignment.lesson != null &&
                !assignment.lesson
                    .toString()
                    .toLowerCase()
                    .includes(filters.lesson.toLowerCase())
            ) {
                return false;
            }

            // Student filter
            if (
                filters.student &&
                assignment.student?.name &&
                assignment.student?.surname
            ) {
                const studentFullName =
                    `${assignment.student.name} ${assignment.student.surname}`.toLowerCase();
                if (
                    !studentFullName.includes(filters.student.toLowerCase())
                ) {
                    return false;
                }
            } else if (filters.student) {
                return false;
            }

            // Group filter
            if (
                filters.groupName &&
                assignment.groupName &&
                !assignment.groupName
                    .toLowerCase()
                    .includes(filters.groupName.toLowerCase())
            ) {
                return false;
            } else if (filters.groupName && !assignment.groupName) {
                return false;
            }

            return true;
        });
    }, [assignments, filters]);

    // Sort logic
    const sortedAndFilteredAssignments = useMemo(() => {
        return [...filteredAssignments].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return (a.title || '').localeCompare(b.title || '');
                case 'status': {
                    const statusOrder = {
                        'waiting-feedback': 1,
                        'long-wait': 2,
                        'passed': 3,
                    };
                    return (
                        (statusOrder[
                            a.status as keyof typeof statusOrder
                        ] || 999) -
                        (statusOrder[
                            b.status as keyof typeof statusOrder
                        ] || 999)
                    );
                }
                case 'date': {
                    const getReplyDate = (lastReply: any) => {
                        if (!lastReply) return '';

                        // Handle different lastReply structures
                        if (lastReply.replyType === 'reply' && lastReply.sentAt) {
                            return lastReply.sentAt;
                        } else if (lastReply.replyType === 'passed' && lastReply.passedAt) {
                            return lastReply.passedAt;
                        }
                        return '';
                    };

                    const aDate = getReplyDate(a.lastReply);
                    const bDate = getReplyDate(b.lastReply);

                    // Handle empty dates
                    if (!aDate) return 1;
                    if (!bDate) return -1;

                    return (
                        new Date(bDate).getTime() -
                        new Date(aDate).getTime()
                    );
                }
                case 'student': {
                    const aStudent =
                        `${a.student?.name || ''} ${a.student?.surname || ''}`.trim();
                    const bStudent =
                        `${b.student?.name || ''} ${b.student?.surname || ''}`.trim();
                    return aStudent.localeCompare(bStudent);
                }
                default:
                    return 0;
            }
        });
    }, [filteredAssignments, sortBy]);

    // Handlers
    const handleApplyFilters = useCallback((newFilters: AssignmentFilters) => {
        setFilters(newFilters);
        setShowFilterModal(false);
    }, []);

    const handleSortChange = useCallback(
        (selected: string | string[] | null) => {
            if (typeof selected === 'string') {
                setSortBy(selected as SortByOption);
            }
        },
        [],
    );

    const handleOpenFilterModal = useCallback(() => {
        setShowFilterModal(true);
    }, []);

    const handleCloseFilterModal = useCallback(() => {
        setShowFilterModal(false);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({});
    }, []);

    // Extract unique values for filter options
    const availableStatuses = useMemo(
        () => {
            const statuses = assignments
                .map((a) => a.status)
                .filter((s) => s !== null && s !== undefined);
            return [...new Set(statuses)];
        },
        [assignments],
    );

    const availableCourses = useMemo(
        () => [
            ...new Set(
                assignments
                    .filter((a): a is typeof a & { course: { title: string } } => 
                        a.course !== undefined && a.course.title !== undefined
                    )
                    .map((a) => a.course.title)
            ),
        ],
        [assignments],
    );

    const availableModules = useMemo(
        () => [
            ...new Set(
                assignments
                    .map((a) => a.module?.toString())
                    .filter((m): m is string => m !== undefined && m !== null),
            ),
        ],
        [assignments],
    );

    const availableLessons = useMemo(
        () => [
            ...new Set(
                assignments
                    .map((a) => a.lesson?.toString())
                    .filter((l): l is string => l !== undefined && l !== null),
            ),
        ],
        [assignments],
    );

    return {
        // State
        filters,
        sortBy,
        showFilterModal,

        // ViewModel state
        assignmentsViewModel,
        isLoading: !assignmentsViewModel,

        // Processed data
        sortedAndFilteredAssignments,

        // Filter options
        availableStatuses,
        availableCourses,
        availableModules,
        availableLessons,

        // Handlers
        handleApplyFilters,
        handleSortChange,
        handleOpenFilterModal,
        handleCloseFilterModal,
        resetFilters,
    };
}