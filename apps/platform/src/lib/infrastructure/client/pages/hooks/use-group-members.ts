/**
 * Custom hook for managing group members data fetching, filtering, and search.
 * 
 * This hook follows the clean code architecture pattern similar to use-assignment-filters:
 * - Encapsulates TRPC query for fetching group members
 * - Manages presenter logic for transforming response to ViewModel
 * - Handles search/filter logic internally
 * - Self-contained with no external data dependencies
 * 
 * @param courseSlug - The course slug identifier
 * @param groupId - The group identifier
 * @param requestType - Type of request ('requestForCoach' or 'requestForStudent')
 * 
 * @returns Object containing:
 * - State: search, setSearch
 * - ViewModel state: membersViewModel, isLoading
 * - Processed data: filteredMembers, allMembers
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/cms-client';
import { useListGroupMembersPresenter } from '../../hooks/use-list-group-members-presenter';

interface UseGroupMembersProps {
    courseSlug: string;
    groupId?: number;
    requestType: 'requestForCoach' | 'requestForStudent';
}

export function useGroupMembers({
    courseSlug,
    groupId,
    requestType,
}: UseGroupMembersProps) {
    const [search, setSearch] = useState<string>('');

    // ViewModel state
    const [membersViewModel, setMembersViewModel] = useState<
        viewModels.TListGroupMembersViewModel | undefined
    >(undefined);

    // Build additional params based on request type
    const additionalParams = useMemo(() => {
        const params: any = { requestType };
        if (requestType === 'requestForCoach' && groupId) {
            params.groupId = groupId;
        }
        return params;
    }, [requestType, groupId]);

    // Fetch group members from listGroupMembers usecase
    const [membersResponse] = trpc.listGroupMembers.useSuspenseQuery({
        courseSlug: courseSlug,
        additionalParams,
    });

    const { presenter: membersPresenter } =
        useListGroupMembersPresenter(setMembersViewModel);

    // Present the data
    useEffect(() => {
        console.log('[useGroupMembers] membersResponse:', membersResponse);
        if (membersResponse) {
            console.log('[useGroupMembers] Calling presenter.present');
            membersPresenter.present(
                // @ts-ignore
                membersResponse,
                membersViewModel,
            );
        }
    }, [membersResponse]);

    // Debug: Log view model state
    useEffect(() => {
        console.log('[useGroupMembers] membersViewModel:', membersViewModel);
        if (membersViewModel?.mode === 'default') {
            console.log('[useGroupMembers] members data:', membersViewModel.data);
        }
    }, [membersViewModel]);

    // Extract members from ViewModel
    const allMembers = useMemo(() => {
        if (
            membersViewModel?.mode === 'default' &&
            membersViewModel.data
        ) {
            return membersViewModel.data.members;
        }
        return [];
    }, [membersViewModel]);

    // Filter members based on search input
    const filteredMembers = useMemo(() => {
        if (!search) return allMembers;

        return allMembers.filter((member) => {
            const studentFullName = `${member.name || ''} ${member.surname || ''}`
                .toLowerCase()
                .trim();
            return studentFullName.includes(search.toLowerCase());
        });
    }, [allMembers, search]);

    // Handlers
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearch('');
    }, []);

    return {
        // State
        search,
        setSearch: handleSearchChange,

        // ViewModel state
        membersViewModel,
        isLoading: !membersViewModel,

        // Processed data
        filteredMembers,
        allMembers,

        // Handlers
        clearSearch,
    };
}