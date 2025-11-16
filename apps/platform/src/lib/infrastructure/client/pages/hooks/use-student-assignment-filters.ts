/**
 * Custom hook for managing student assignment filtering, sorting, and data fetching.
 *
 * Similar to use-assignment-filters but uses listStudentAssignments instead of listGroupAssignments.
 * This hook is specifically for:
 * - Student viewing their own assignments in a course
 * - Coach viewing a specific student's assignments
 *
 * @param courseSlug - The course slug identifier
 * @param requestType - Type of request ('requestForStudent' or 'requestForCoach')
 * @param studentUsername - Optional student username (required when requestType is 'requestForCoach')
 * @param initialFilters - Optional initial filter state
 *
 * @returns Object containing:
 * - State: filters, sortBy, showFilterModal
 * - ViewModel state: assignmentsViewModel, isLoading
 * - Processed data: sortedAndFilteredAssignments
 * - Filter options: availableStatuses, availableModules, availableLessons
 * - Handlers: handleApplyFilters, handleSortChange, handleOpenFilterModal, handleCloseFilterModal, resetFilters
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListStudentAssignmentsPresenter } from '../../hooks/use-list-student-assignments-presenter';
import { trpc } from '../../trpc/cms-client';

interface AssignmentFilters {
    title?: string;
    status?: string[];
    module?: string;
    lesson?: string;
}

interface UseStudentAssignmentFiltersProps {
    courseSlug: string;
    requestType: 'requestForStudent' | 'requestForCoach';
    studentUsername?: string;
    initialFilters?: AssignmentFilters;
}

type SortByOption = 'title' | 'status' | 'date';

export function useStudentAssignmentFilters({
    courseSlug,
    requestType,
    studentUsername,
    initialFilters = {},
}: UseStudentAssignmentFiltersProps) {
    const [filters, setFilters] = useState<AssignmentFilters>(initialFilters);
    const [sortBy, setSortBy] = useState<SortByOption>('title');
    const [showFilterModal, setShowFilterModal] = useState(false);

    // ViewModel state
    const [assignmentsViewModel, setAssignmentsViewModel] = useState<
        viewModels.TListStudentAssignmentsViewModel | undefined
    >(undefined);

    // Build additional params based on request type
    const additionalParams = useMemo(() => {
        if (requestType === 'requestForCoach') {
            return {
                requestType: 'requestForCoach' as const,
                studentUsername,
            };
        }
        return {
            requestType: 'requestForStudent' as const,
        };
    }, [requestType, studentUsername]);

    // Fetch student assignments from listStudentAssignments usecase
    const [assignmentsResponse] = trpc.listStudentAssignments.useSuspenseQuery({
        courseSlug: courseSlug,
        additionalParams,
    });

    const { presenter: assignmentsPresenter } =
        useListStudentAssignmentsPresenter(setAssignmentsViewModel);

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
