'use client';

import {
    Breadcrumbs,
    Button,
    IconCalendar,
    IconEdit,
    UserAvatar,
    Badge,
    IconStar,
    Dialog,
    DialogContent,
    DialogTrigger,
    useDialog,
    DefaultError,
    DefaultLoading,
    RedeemStandaloneCoupon,
    IconCoupon,
    ConfirmationModal,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCoursesList from './user-courses-list';
import UserCoachingSessions from './user-coaching-sessions';
import UserNotifications from './user-notifications';
import CoachDashboardStudents from './coach-dashboard-students';
import CoachDashboardReviews from './coach-dashboard-reviews';
import { trpc } from '../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPersonalProfilePresenter } from '../../hooks/use-get-personal-profile-presenter';
import { useRedeemStandaloneCouponPresenter } from '../../hooks/use-redeem-standalone-coupon-presenter';

interface UserDashboardProps {
    roles: string[];
}

function RedeemCouponDialogContent() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.userDashboard');
    const { setIsOpen } = useDialog();
    const utils = trpc.useUtils();

    // Error modal state
    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });

    // Set up view model and presenter
    const [redeemViewModel, setRedeemViewModel] = useState<
        viewModels.TRedeemStandaloneCouponViewModel | undefined
    >(undefined);
    const { presenter: redeemPresenter } = useRedeemStandaloneCouponPresenter(
        setRedeemViewModel
    );

    // Mutation for validating and redeeming coupon
    const redeemCouponMutation = trpc.redeemStandaloneCoupon.useMutation({
        onSuccess: () => {
            // Invalidate queries to refetch user data after successful redemption
            void utils.listUserCourses.invalidate();
            void utils.listUpcomingStudentCoachingSessions.invalidate();
            void utils.listStudentCoachingSessions.invalidate();
            void utils.listNotifications.invalidate();
        }
    });

    const handleRedeem = async (couponCode: string) => {
        try {
            const response = await redeemCouponMutation.mutateAsync({
                couponName: couponCode,
            });

            // Present the response using the presenter
            if (redeemPresenter) {
                // @ts-ignore
                redeemPresenter.present(response, redeemViewModel);
            }

            if (response.success && 'data' in response) {
                // Map the backend response to the component's expected format
                const outcome = (response as any).data.outcome;

                // Determine the type based on outcome
                let type: 'course' | 'package' | 'coaching' | 'group' = 'course';
                let title: string | undefined = undefined;
                let imageUrl: string | undefined = undefined;
                let courses: { title: string; imageUrl?: string }[] | undefined = undefined;

                switch (outcome.type) {
                    case 'freeCourses':
                        type = 'course';
                        // Map all courses from the response
                        courses = outcome.courses.map((course: any) => ({
                            title: course.title,
                            imageUrl: course.imageUrl || undefined,
                        }));
                        break;
                    case 'freePackages':
                        type = 'package';
                        title = t('coupon.packageCoursesCount').replace('{count}', outcome.courses.length.toString());
                        imageUrl = outcome.courses[0]?.imageUrl || undefined;
                        break;
                    case 'freeCoachingSession':
                        type = 'coaching';
                        if (outcome.coachingOfferings.length > 1) {
                            courses = outcome.coachingOfferings.map((offering: any) => ({
                                title: `${offering.title} (${offering.count} ${offering.count > 1 ? 'sessions' : 'session'})`,
                                imageUrl: undefined,
                            }));
                        } else {
                            const offering = outcome.coachingOfferings[0];
                            title = offering
                                ? `${offering.title} (${offering.count} ${offering.count > 1 ? 'sessions' : 'session'})`
                                : 'Coaching Session';
                        }
                        imageUrl = outcome.course?.imageUrl || undefined;
                        break;
                    case 'groupCourse':
                        type = 'group';
                        title = outcome.group.name;
                        imageUrl = outcome.course.imageUrl || undefined;
                        break;
                    case 'groupPackage':
                        type = 'group';
                        title = outcome.group.name;
                        imageUrl = outcome.courses?.[0]?.imageUrl || undefined;
                        courses = outcome.courses?.map((course: any) => ({
                            title: course.title,
                            imageUrl: course.imageUrl || undefined,
                        }));
                        break;
                }

                // Invalidate queries to refetch user data after successful redemption
                void utils.listUserCourses.invalidate();
                void utils.listUpcomingStudentCoachingSessions.invalidate();
                void utils.listStudentCoachingSessions.invalidate();
                void utils.listNotifications.invalidate();

                return {
                    valid: true,
                    data: {
                        type,
                        title,
                        imageUrl,
                        courses,
                    },
                };
            }

            return {
                valid: false,
            };
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: t('coupon.error.redeemFailedTitle'),
                message: `${t('coupon.error.redeemFailed')}: ${error.message || t('coupon.error.redeemFailedGeneric')}`,
            });
            return {
                valid: false,
            };
        }
    };

    return (
        <>
            <div className="p-6">
                <RedeemStandaloneCoupon
                    locale={locale}
                    onRedeem={handleRedeem}
                    onClose={() => setIsOpen(false)}
                />
            </div>

            {/* Error Modal */}
            <ConfirmationModal
                type="accept"
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                locale={locale}
            />
        </>
    );
}

function RedeemCouponDialog() {
    const t = useTranslations('pages.userDashboard');

    return (
        <Dialog
            open={undefined}
            onOpenChange={() => {
                // This function is called when the dialog is opened or closed
            }}
            defaultOpen={false}
        >
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    hasIconLeft
                    iconLeft={<IconCoupon />}
                    size="medium"
                    text={t('redeemCoupon')}
                />
            </DialogTrigger>
            <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
                <RedeemCouponDialogContent />
            </DialogContent>
        </Dialog>
    );
}


export default function UserDashboard({ roles }: UserDashboardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const t = useTranslations('pages.userDashboard');

    // Determine if user is a coach
    const isCoach = useMemo(() => roles.includes('coach'), [roles]);

    // Fetch personal profile to get full name
    const [personalProfileResponse] = trpc.getPersonalProfile.useSuspenseQuery({});

    // Set up view model and presenter for personal profile
    const [personalProfileViewModel, setPersonalProfileViewModel] = useState<
        viewModels.TGetPersonalProfileViewModel | undefined
    >(undefined);
    const { presenter: personalProfilePresenter } = useGetPersonalProfilePresenter(
        setPersonalProfileViewModel
    );

    // Present personal profile data when available
    useEffect(() => {
        if (personalProfileResponse && personalProfilePresenter) {
            // @ts-ignore
            personalProfilePresenter.present(personalProfileResponse, personalProfileViewModel);
        }
    }, [personalProfileResponse, personalProfilePresenter]);

    // Fetch coach reviews if user is a coach (matches server prefetch)
    const [reviewsResponse] = isCoach
        ? trpc.listCoachReviews.useSuspenseQuery({
            coachUsername: session?.user?.name || '',
        })
        : [null];

    // Calculate average rating from reviews
    const averageRating = useMemo(() => {
        // @ts-ignore - tRPC response structure
        const reviews = reviewsResponse?.data?.reviews;
        if (!reviews || reviews.length === 0) {
            return null;
        }

        const ratings = reviews.map((review: any) => review.rating);
        const totalRating = ratings.reduce(
            (sum: number, rating: number) => sum + rating,
            0,
        );
        const average = totalRating / reviews.length;

        return Math.round(average * 10) / 10;
    }, [reviewsResponse]);

    const handleEditProfile = useCallback(() => {
        router.push('/workspace/profile');
    }, [router]);

    const handleViewCalendar = useCallback(() => {
        router.push('/workspace/calendar');
    }, [router]);

    const handleViewAllCourses = useCallback(() => {
        router.push(`/${locale}/workspace/courses`);
    }, [router, locale]);

    const getDisplayName = useCallback(() => {
        if (personalProfileViewModel?.mode === 'default') {
            const profile = personalProfileViewModel.data.profile;
            if (profile?.name && profile?.surname) {
                return `${profile.name} ${profile.surname}`;
            }
        }
        return session?.user?.name ?? '';
    }, [personalProfileViewModel, session]);

    const formatRoles = useCallback(() => {
        if (!roles || roles.length === 0) return [];

        // Filter out visitor and student roles, then format role names properly
        return roles
            .filter((role) => role !== 'visitor' && role !== 'student')
            .map((role) =>
                role
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            );
    }, [roles]);

    // NOTE: Authentication is handled by middleware for protected routes.
    // Session expiration is handled by SessionMonitorWrapper.
    // No client-side auth redirect needed here.

    // Handle loading state
    if (!personalProfileViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Handle kaboom (error) state
    if (personalProfileViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('errorFailed')}
                description={t('errorFailed')}
            />
        );
    }

    return (
        <div className="min-h-screen text-white">
            <div className="flex flex-col space-y-2 p-6">
                <Breadcrumbs
                    items={[
                        {
                            label: breadcrumbsTranslations('home'),
                            onClick: () => {
                                router.push('/');
                            },
                        },
                        {
                            label: breadcrumbsTranslations('workspace'),
                            onClick: () => {
                                // Nothing should happen on clicking the current page
                            },
                        },
                    ]}
                />
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center pb-15">
                    <div className="flex items-center space-x-4">
                        <UserAvatar
                            size="xLarge"
                            imageUrl={session?.user?.image ?? undefined}
                            fullName={getDisplayName()}
                        />
                        <div className="flex flex-col space-y-2">
                            <h1>{getDisplayName()}</h1>
                            <div className="flex gap-2 flex-wrap">
                                {formatRoles().map((role) => (
                                    <Badge
                                        key={role}
                                        text={role}
                                        variant="info"
                                        size="medium"
                                    />
                                ))}
                                {isCoach && averageRating !== null && (
                                    <Badge
                                        text={averageRating.toString()}
                                        variant="primary"
                                        size="medium"
                                        hasIconLeft
                                        iconLeft={
                                            <IconStar className="w-3 h-3" />
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="text"
                            hasIconLeft
                            iconLeft={<IconEdit />}
                            size="medium"
                            onClick={handleEditProfile}
                        >
                            {t('editProfile')}
                        </Button>

                        <RedeemCouponDialog />

                        <Button
                            variant="primary"
                            hasIconLeft
                            iconLeft={<IconCalendar />}
                            size="medium"
                            onClick={handleViewCalendar}
                        >
                            {t('viewCalendar')}
                        </Button>
                    </div>
                </div>
                {/* Conditional rendering based on role */}
                {isCoach ? (
                    // Coach Dashboard Layout
                    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
                        <div className="xl:col-span-3 lg:col-span-2 space-y-6">
                            <UserCoachingSessions
                                studentUsername={session?.user?.name}
                                isCoach={true}
                            />

                            {/* Your courses */}
                            <div className="flex items-center justify-between">
                                <h3> {t('yourCourses')} </h3>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleViewAllCourses}
                                    text={t('viewAllCourses')}
                                />
                            </div>
                            <UserCoursesList maxItems={3} />

                            <CoachDashboardStudents />
                            <CoachDashboardReviews />
                        </div>
                        <div className="xl:col-span-1 lg:col-span-1">
                            <UserNotifications />
                        </div>
                    </div>
                ) : (
                    // Student Dashboard Layout
                    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
                        <div className="xl:col-span-3 lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3> {t('yourCourses')} </h3>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleViewAllCourses}
                                    text={t('viewAllCourses')}
                                />
                            </div>
                            <UserCoursesList maxItems={3} />
                            <UserCoachingSessions
                                studentUsername={session?.user?.name}
                            />
                        </div>
                        <div className="xl:col-span-1 lg:col-span-1">
                            <UserNotifications />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
