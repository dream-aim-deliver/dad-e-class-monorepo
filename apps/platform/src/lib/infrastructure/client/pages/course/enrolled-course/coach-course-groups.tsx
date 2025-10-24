'use client';

import {
    DefaultLoading,
    DefaultError,
    GroupsList,
    Button,
} from '@maany_shr/e-class-ui-kit';
import type { GroupOverviewCardDetails } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useListCourseGroupsPresenter } from '../../../hooks/use-list-course-groups-presenter';
import { trpc as trpcMock } from '../../../trpc/client';
import MockTRPCClientProviders from '../../../trpc/mock-client-providers';
import { useGroupMutations } from './hooks/use-group-mutations';

interface EnrolledCourseGroupsProps {
    courseSlug: string;
    currentRole: string;
}

// TODO: Update type when backend schema is ready - extract from usecase models
type Group = any; // TODO: Replace with proper type from useCaseModels when available

function CoachCourseGroupsContent(props: EnrolledCourseGroupsProps) {
    const locale = useLocale() as TLocale;
    // TODO: Add proper translations when ready
    
    // Fetch course-specific groups data using TRPC Mock Client
    const [courseGroupsResponse, { refetch: refetchGroups }] = 
        trpcMock.listCourseGroups.useSuspenseQuery({
            courseSlug: props.courseSlug,
        });

    // Set up presenter for transforming the response to view model
    const [courseGroupsViewModel, setCourseGroupsViewModel] = useState<
        viewModels.TListCourseGroupsViewModel | undefined
    >(undefined);

    // Set up presenter
    const { presenter: courseGroupsPresenter } = useListCourseGroupsPresenter(
        setCourseGroupsViewModel,
    );

    // For now, bypass the presenter and use the data directly
    // TODO: Connect to proper presenter when backend is ready
    const mockGroups = courseGroupsResponse?.groups || [];

    // Get groups from the mock response directly
    const serverGroups = useMemo(() => {
        return mockGroups;
    }, [mockGroups]);

    // Transform server groups to UI format
    const transformedGroups: GroupOverviewCardDetails[] = useMemo(() => {
        const transformed = serverGroups.map((group: Group) => ({
            groupName: group.groupName,
            currentStudents: group.currentStudents,
            totalStudents: group.totalStudents,
            course: {
                image: group.course.image,
                title: group.course.title,
                slug: group.course.slug,
            },
            coach: group.coach ? {
                name: group.coach.name,
                isCurrentUser: group.coach.isCurrentUser,
            } : undefined,
            creator: group.creator ? {
                name: group.creator.name,
                image: group.creator.image,
            } : undefined,
        }));
        return transformed;
    }, [serverGroups]);

    // State for coupon code - TODO: Connect to backend for validation
    const [couponCode, setCouponCode] = useState<string>('');
    const [isValidating, setIsValidating] = useState<boolean>(false);

    // Determine if user is admin/coach - TODO: Get from backend user permissions
    // TEMP: Force isAdmin to true to test UI - replace with real role check when backend is ready
    const isAdmin = true; // TODO: Use real role from backend: props.currentRole === 'coach' || props.currentRole === 'course_creator'

    // Use the group mutations hook
    const {
        registerCoachToGroup,
        isLoading: isMutating,
        clearError,
        registerCoachViewModel,
    } = useGroupMutations(
        props.courseSlug,
        undefined, // TODO: Add refetch callback if needed
        (groupId, coachId) => {
            console.log('Coach registered to group:', groupId, coachId);
            // TODO: Handle successful registration if needed
        },
    );

    // Handle coupon code validation - TODO: Implement backend validation
    const handleValidateCode = useCallback(async () => {
        setIsValidating(true);
        
        // Mock validation delay
        setTimeout(() => {
            setIsValidating(false);
            // TODO: Show success/error message from backend
        }, 1000);
    }, [couponCode]);

    // Handle course navigation - TODO: Implement proper routing
    const handleClickCourse = useCallback((slug: string) => {
        // TODO: Implement course navigation with router
    }, []);

    // Handle group management - TODO: Connect to backend group management
    const handleManageGroup = useCallback((groupId: string) => {
        // TODO: Navigate to group management page or open management modal
    }, []);

    // Handle view group profile - TODO: Connect to backend for group details
    const handleClickViewProfile = useCallback((groupId: string) => {
        // TODO: Navigate to group profile page or open profile modal
    }, []);

    // TODO: Re-enable when proper presenter is connected
    // if (!courseGroupsViewModel) {
    //     return <DefaultLoading locale={locale} variant="minimal" />;
    // }

    // if (courseGroupsViewModel.mode === 'not-found') {
    //     return (
    //         <DefaultError
    //             locale={locale}
    //             description="No groups found for this course" // TODO: Add to translations
    //         />
    //     );
    // }

    // if (courseGroupsViewModel.mode === 'kaboom') {
    //     return <DefaultError locale={locale} />;
    // }

    // Check for mutation errors and show as full page errors
    if (
        registerCoachViewModel?.mode === 'kaboom'
    ) {
        const errorMessage = registerCoachViewModel.data.message;
        return <DefaultError locale={locale} description={errorMessage} />;
    }

    return (
        <GroupsList
            locale={locale}
            allGroups={transformedGroups}
            isAdmin={isAdmin}
            joinGroupVariant="empty" // TODO: Determine variant from backend group state
            couponCode={couponCode}
            onCouponCodeChange={setCouponCode}
            onValidateCode={handleValidateCode}
            onClickCourse={handleClickCourse}
            onClickManage={handleManageGroup}
            onClickViewProfile={handleClickViewProfile}
            isValidating={isValidating}
            isLoading={isMutating} // Use mutation loading state
        />
    );
}

export default function CoachCourseGroups(props: EnrolledCourseGroupsProps) {
    const locale = useLocale() as TLocale;

    return (
        // We need MockTRPCClientProviders for the mock data - remove when we have real TRPC client
        <MockTRPCClientProviders>
            <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                <CoachCourseGroupsContent {...props} />
            </Suspense>
        </MockTRPCClientProviders>
    );
}
