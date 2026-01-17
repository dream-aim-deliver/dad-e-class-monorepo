'use client';

import {
    DefaultLoading,
    DefaultError,
    GroupsList,
    Button,
} from '@maany_shr/e-class-ui-kit';
import type { GroupOverviewCardDetails } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useState, useMemo, useCallback } from 'react';
import { trpc } from '../../../trpc/cms-client';
import { useListCourseGroupsPresenter } from '../../../hooks/use-list-course-groups-presenter';
import useClientSidePagination from '../../../utils/use-client-side-pagination';
import { useTranslations } from 'next-intl';


interface EnrolledCourseGroupsProps {
    courseSlug: string;
    currentRole: string;
}

// Backend data structure from the API
interface BackendGroup {
    id: number;
    name: string;
    actualStudentCount: number;
    maxStudentCount: number;
    course: {
        id: number;
        title: string;
        slug: string;
        imageUrl: string;
    };
    coaches: Array<{
        id: number;
        username: string;
        name: string;
        surname: string;
        avatarUrl: string;
        isCurrentUser: boolean;
    }>;
}

export default function CoachCourseGroups({
    courseSlug,
    currentRole,
}: EnrolledCourseGroupsProps) {
    const locale = useLocale() as TLocale;

    // Add translations
    const t = useTranslations('pages.course.groups');

    const [groupsResponse] = trpc.listCourseGroups.useSuspenseQuery({
        courseSlug,
    });

    const [groupsViewModel, setGroupsViewModel] = useState<
        viewModels.TListCourseGroupsViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseGroupsPresenter(setGroupsViewModel);
    
    const utils = trpc.useUtils();
    
    const registerCoachMutation = trpc.registerCoachToGroup.useMutation({
        onSuccess: (data) => {
            // Clear the coupon code on success
            setCouponCode('');
            setValidationError('');
            // Refetch groups to get updated data
            utils.listCourseGroups.invalidate({ courseSlug });
        },
        onError: (error) => {
            setValidationError(error.message || 'Failed to register coach');
        }
    });

    // State for coupon code handling
    const [couponCode, setCouponCode] = useState<string>('');
    const [validationError, setValidationError] = useState<string>('');
    
    // State for load more loading
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    // Transform backend groups data to UI format
    const transformedGroups: GroupOverviewCardDetails[] = useMemo(() => {
        // Access groups from the TRPC response structure - using type assertion due to mock typing
        const responseData = groupsResponse as any;
        const groups = responseData?.data?.groups || [];
        
        if (!Array.isArray(groups)) return [];

        return (groups as BackendGroup[]).map((group: BackendGroup) => {
            // For creator, use the first coach as creator (or could be a separate field)
            const creator = group.coaches && group.coaches[0];

            return {
                groupName: group.name,
                currentStudents: group.actualStudentCount,
                totalStudents: group.maxStudentCount,
                course: {
                    image: group.course.imageUrl || '',
                    title: group.course.title,
                    slug: group.course.slug,
                },
                coaches: group.coaches?.map(coach => ({
                    name: `${coach.name} ${coach.surname}`,
                    isCurrentUser: coach.isCurrentUser,
                    avatarUrl: coach.avatarUrl || undefined,
                })) || [],
                creator: creator ? {
                    name: `${creator.name} ${creator.surname}`,
                    image: creator.avatarUrl || undefined,
                } : {
                    name: t('unknownCreator'),
                    image: undefined,
                },
            };
        });
    }, [groupsResponse, t]);

    // Use client-side pagination for groups
    const {
        displayedItems: displayedGroups,
        hasMoreItems,
        handleLoadMore: originalHandleLoadMore,
    } = useClientSidePagination({
        items: transformedGroups,
        itemsPerPage: 6, // Show 6 groups initially
        itemsPerPage2xl: 9, // Show 9 groups on 2xl screens
    });

    // Enhanced load more handler with loading state
    const handleLoadMore = useCallback(() => {
        setIsLoadingMore(true);
        originalHandleLoadMore();
        setIsLoadingMore(false);
    }, [originalHandleLoadMore]);

    // Handle coupon code changes
    const handleCouponCodeChange = useCallback((value: string) => {
        setCouponCode(value);
        // Clear validation error when user starts typing
        if (validationError) {
            setValidationError('');
        }
    }, [validationError]);

    // Handle coupon code validation and registration
    const handleValidateCode = useCallback(() => {
        if (!couponCode.trim()) return;
        
        setValidationError('');
        registerCoachMutation.mutate({
            couponCode: couponCode.trim(),
        });
    }, [couponCode, registerCoachMutation]);

    // Handle course navigation
    const handleClickCourse = useCallback((slug: string) => {
        // TODO: Implement navigation to course page
    }, []);

    // Handle group management
    const handleManageGroup = useCallback((groupId: string) => {
        // TODO: Implement group management navigation
    }, []);



    if (!groupsResponse) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    const responseData = groupsResponse as any;
    if (!responseData.success || !responseData.data) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    return (
        <div className="space-y-6">
            <GroupsList
                locale={locale}
                allGroups={displayedGroups}
                couponCode={couponCode}
                onCouponCodeChange={handleCouponCodeChange}
                onValidateCode={handleValidateCode}
                onClickCourse={handleClickCourse}
                onClickManage={handleManageGroup}
                isValidating={registerCoachMutation.isPending}
                hasValidationMessage={!!validationError}
                validationMessage={validationError}
                isLoading={registerCoachMutation.isPending}
            />
            
            {/* Load More Button */}
            {hasMoreItems && (
                <div className="flex justify-center mt-8">
                    <Button
                        variant="text"
                        size="medium"
                        onClick={handleLoadMore}
                        text={isLoadingMore ? t('loading') : t('loadMoreButton')}
                        disabled={isLoadingMore}
                    />
                </div>
            )}
        </div>
    );
}
