'use client';

import {
    Breadcrumbs,
    Button,
    IconCalendar,
    IconEdit,
    UserAvatar,
    Badge,
    IconStar,
    CreateCourseModal,
    Dialog,
    DialogContent,
    DialogTrigger,
    useDialog,
    DefaultError,
    DefaultLoading,
    RedeemStandaloneCoupon,
    IconCoupon,
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

function useDebounce(value: any, delay: number): any {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

interface CreateCourseDialogContentProps {
    onDuplicationSuccess: () => void;
}

function CreateCourseDialogContent({
    onDuplicationSuccess,
}: CreateCourseDialogContentProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const { setIsOpen } = useDialog();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 250);

    const {
        data: coursesResponse,
        isFetching,
        error,
    } = trpc.listPlatformCoursesShort.useQuery({});

    const duplicateCourseMutation = trpc.duplicateCourse.useMutation();

    const courses = coursesResponse?.success && (coursesResponse as any).data.courses
        ? (coursesResponse as any).data.courses.filter((course: any) =>
            course.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="p-6">
            <CreateCourseModal
                locale={locale}
                isLoading={isFetching}
                onCreateNew={() => {
                    router.push('/create/course');
                    setIsOpen(false);
                }}
                onDuplicate={async (course) => {
                    await duplicateCourseMutation.mutateAsync({
                        sourceCourseSlug: course.slug,
                    });
                    setIsOpen(false);
                    onDuplicationSuccess();
                }}
                onQueryChange={(query) => {
                    setSearchQuery(query);
                }}
                courses={courses.map((course: any) => ({
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    author: {
                        name: '',
                        surname: '',
                        isYou: false,
                    },
                }))}
                onClose={() => setIsOpen(false)}
                hasSearchError={!!error || (coursesResponse?.success === false)}
            />
        </div>
    );
}

interface CreateCourseDialogProps {
    onDuplicationSuccess: () => void;
}

function CreateCourseDialog({
    onDuplicationSuccess,
}: CreateCourseDialogProps) {
    const t = useTranslations('pages.userCourses');

    return (
        <Dialog
            open={undefined}
            onOpenChange={() => {
                // This function is called when the dialog is opened or closed
            }}
            defaultOpen={false}
        >
            <DialogTrigger asChild>
                <Button text={t('createCourse')} />
            </DialogTrigger>
            <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
                <CreateCourseDialogContent
                    onDuplicationSuccess={onDuplicationSuccess}
                />
            </DialogContent>
        </Dialog>
    );
}

function RedeemCouponDialogContent() {
    const locale = useLocale() as TLocale;
    const { setIsOpen } = useDialog();
    const router = useRouter();
    const utils = trpc.useUtils();

    // Set up view model and presenter
    const [redeemViewModel, setRedeemViewModel] = useState<
        viewModels.TRedeemStandaloneCouponViewModel | undefined
    >(undefined);
    const { presenter: redeemPresenter } = useRedeemStandaloneCouponPresenter(
        setRedeemViewModel
    );

    // Mutation for validating and redeeming coupon
    const redeemCouponMutation = trpc.redeemStandaloneCoupon.useMutation();

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
                let title = '';
                let imageUrl: string | undefined = undefined;

                switch (outcome.type) {
                    case 'freeCourses':
                        type = 'course';
                        title = outcome.courses[0]?.title || 'Free Course';
                        imageUrl = outcome.courses[0]?.imageUrl || undefined;
                        break;
                    case 'freeBundles':
                        type = 'package';
                        title = `Bundle with ${outcome.courses.length} courses`;
                        imageUrl = outcome.courses[0]?.imageUrl || undefined;
                        break;
                    case 'freeCoachingSession':
                        type = 'coaching';
                        title = outcome.coachingOfferings[0]?.title || 'Coaching Session';
                        imageUrl = outcome.course?.imageUrl || undefined;
                        break;
                    case 'groupCourse':
                        type = 'group';
                        title = outcome.group.name;
                        imageUrl = outcome.course.imageUrl || undefined;
                        break;
                }

                return {
                    valid: true,
                    data: {
                        type,
                        title,
                        imageUrl,
                    },
                };
            }

            return {
                valid: false,
            };
        } catch (error) {
            console.error('Error redeeming coupon:', error);
            return {
                valid: false,
            };
        }
    };

    const handleFinalRedeem = async (
        _couponCode: string,
        data: { type: 'course' | 'package' | 'coaching' | 'group'; title: string; imageUrl?: string }
    ) => {
        // Invalidate queries to refetch user data after successful redemption
        void utils.listUserCourses.invalidate();
        void utils.listUpcomingStudentCoachingSessions.invalidate();

        // Note: Modal will stay open to show success state
        // User can close it manually or component will handle navigation
    };

    return (
        <div className="p-6">
            <RedeemStandaloneCoupon
                locale={locale}
                onRedeem={handleRedeem}
                onFinalRedeem={handleFinalRedeem}
                onClose={() => setIsOpen(false)}
            />
        </div>
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

    const utils = trpc.useUtils();

    // Duplication handler
    const handleDuplicationSuccess = useCallback(() => {
        // Invalidate and refetch user courses
        utils.listUserCourses.invalidate();
        utils.listPlatformCoursesShort.invalidate();
    }, [utils]);

    // Determine if user is a coach
    const isCoach = useMemo(() => roles.includes('coach'), [roles]);
    const isAdmin = useMemo(() => roles.includes('admin'), [roles]);

    // Fetch personal profile to get full name
    const { data: personalProfileResponse } = trpc.getPersonalProfile.useQuery({});

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
    }, [personalProfileResponse, personalProfilePresenter, personalProfileViewModel]);

    // Fetch coach reviews if user is a coach
    const { data: reviewsResponse } = trpc.listCoachReviews.useQuery(
        {
            coachUsername: session?.user?.name || '',
        },
        {
            enabled: isCoach && !!session?.user?.name,
        },
    );

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
        return isCoach ? 'Coach' : 'Student';
    }, [personalProfileViewModel, isCoach]);

    const formatRoles = useCallback(() => {
        if (!roles || roles.length === 0) return [];

        // Filter out visitor and student roles, then capitalize first letter of each role
        return roles
            .filter((role) => role !== 'visitor' && role !== 'student')
            .map((role) => role.charAt(0).toUpperCase() + role.slice(1));
    }, [roles]);

    // Handle loading state
    if (!personalProfileViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Handle kaboom (error) state
    if (personalProfileViewModel.mode === 'kaboom') {
        return (
            <DefaultError
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
                            <UserCoachingSessions />

                            {/* Your courses and Create course button and modal */}
                            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                                <div className="flex items-center">
                                    <h3> {t('yourCourses')} </h3>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={handleViewAllCourses}
                                        text={t('viewAllCourses')}
                                    />
                                </div>
                                {isAdmin && (
                                    <CreateCourseDialog
                                        onDuplicationSuccess={handleDuplicationSuccess}
                                    />
                                )}
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
                            <h3> {t('yourCourses')} </h3>
                            <UserCoursesList maxItems={3} />
                            <UserCoachingSessions />
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
