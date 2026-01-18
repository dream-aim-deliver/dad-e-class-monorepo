'use client';

import {
    DefaultLoading,
    DefaultError,
    GroupsList,
    Button,
} from '@maany_shr/e-class-ui-kit';
import type { GroupOverviewCardDetails } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { trpc } from '../../../trpc/cms-client';
import { useListCourseGroupsPresenter } from '../../../hooks/use-list-course-groups-presenter';
import { useRegisterCoachToGroupPresenter } from '../../../hooks/use-register-coach-to-group-presenter';
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
    maxStudentCount?: number | null;
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
    const router = useRouter();

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

    // State for coupon code handling
    const [couponCode, setCouponCode] = useState<string>('');

    // View model state for register mutation result
    const [registerViewModel, setRegisterViewModel] = useState<
        viewModels.TRegisterCoachToGroupViewModel | undefined
    >(undefined);

    // Presenter for transforming mutation results
    const { presenter: registerPresenter } = useRegisterCoachToGroupPresenter(setRegisterViewModel);

    const registerCoachMutation = trpc.registerCoachToGroup.useMutation();

    // Derive feedback from view model
    const feedbackMessage = useMemo(() => {
        if (!registerViewModel) return undefined;
        if (registerViewModel.mode === 'default') {
            return { type: 'success' as const, message: t('couponSuccess') };
        }
        if (registerViewModel.mode === 'kaboom' || registerViewModel.mode === 'not-found') {
            return { type: 'error' as const, message: t('couponError') };
        }
        return undefined;
    }, [registerViewModel, t]);

    // Auto-dismiss feedback after 10 seconds
    useEffect(() => {
        if (registerViewModel) {
            const timer = setTimeout(() => {
                setRegisterViewModel(undefined);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [registerViewModel]);

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
                groupId: group.id,
                groupName: group.name,
                currentStudents: group.actualStudentCount,
                totalStudents: group.maxStudentCount ?? undefined,
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
        // Clear feedback when user starts typing
        if (registerViewModel) {
            setRegisterViewModel(undefined);
        }
    }, [registerViewModel]);

    // Handle coupon code validation and registration
    const handleValidateCode = useCallback(async () => {
        if (!couponCode.trim()) return;

        // Reset view model before operation
        setRegisterViewModel(undefined);

        const result = await registerCoachMutation.mutateAsync({
            couponCode: couponCode.trim(),
        });

        // Pass through presenter to update view model
        // @ts-ignore
        await registerPresenter.present(result, registerViewModel);

        if (result.success) {
            setCouponCode('');
            utils.listCourseGroups.invalidate({ courseSlug });
        }
    }, [couponCode, registerCoachMutation, registerPresenter, registerViewModel, utils, courseSlug]);

    // Handle course navigation
    const handleClickCourse = useCallback((slug: string) => {
        // TODO: Implement navigation to course page
    }, []);

    // Handle group management
    const handleManageGroup = useCallback((groupId: string) => {
        router.push(`/${locale}/workspace/courses/${courseSlug}/groups/${groupId}`);
    }, [router, locale, courseSlug]);



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
                hasValidationMessage={!!feedbackMessage}
                validationMessage={feedbackMessage?.message}
                validationMessageType={feedbackMessage?.type}
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
