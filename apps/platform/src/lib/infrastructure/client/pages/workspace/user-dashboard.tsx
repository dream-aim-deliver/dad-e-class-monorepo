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
// TODO: Change back to cms-client once searchCourses is available in the CMS REST API
import { trpc } from '../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useSearchCoursesPresenter } from '../../hooks/use-search-courses-presenter';

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

function CreateCourseDialogContent() {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const { setIsOpen } = useDialog();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 250);

    const {
        data: searchResponse,
        isFetching,
        error,
    } = trpc.searchCourses.useQuery(
        {
            titleContains: debouncedSearchQuery,
            pagination: {
                page: 1,
                pageSize: 4,
            },
        },
        {},
    );
    const [searchViewModel, setSearchViewModel] = useState<
        viewModels.TCourseSearchViewModel | undefined
    >(undefined);
    const { presenter } = useSearchCoursesPresenter(setSearchViewModel);
    useEffect(() => {
        if (searchResponse) {
            presenter.present(searchResponse, searchViewModel);
        }
    }, [searchResponse, setSearchViewModel]);

    const courses =
        searchViewModel?.mode === 'default' ? searchViewModel.data.courses : [];

    return (
        <div className="p-6">
            <CreateCourseModal
                locale={locale}
                isLoading={isFetching}
                onCreateNew={() => {
                    router.push('/create/course');
                    setIsOpen(false);
                }}
                onDuplicate={(course) => {
                    router.push(`/create/course?duplicate=${course.slug}`);
                    setIsOpen(false);
                }}
                onQueryChange={(query) => setSearchQuery(query)}
                courses={courses.map((course) => ({
                    ...course,
                    author: {
                        ...course.author,
                        isYou: false,
                        avatarUrl: course.author.avatarUrl ?? '',
                    },
                }))}
                onClose={() => setIsOpen(false)}
                hasSearchError={!!error || searchViewModel?.mode === 'kaboom'}
            />
        </div>
    );
}

function CreateCourseDialog() {
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
                <CreateCourseDialogContent />
            </DialogContent>
        </Dialog>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default function UserDashboard({ roles }: UserDashboardProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const t = useTranslations('pages.userDashboard');

    // Determine if user is a coach
    const isCoach = useMemo(() => roles.includes('coach'), [roles]);
    const isAdmin = useMemo(() => roles.includes('admin'), [roles]);

    // Fetch coach reviews if user is a coach
    const { data: reviewsResponse } = trpc.listCoachReviews.useQuery(
        {
            coachUsername: session?.user?.name || '',
        },
        {
            enabled: isCoach && !!session?.user?.name,
        }
    );

    // Calculate average rating from reviews
    const averageRating = useMemo(() => {
        // @ts-ignore - tRPC response structure
        const reviews = reviewsResponse?.data?.reviews;
        if (!reviews || reviews.length === 0) {
            return null;
        }

        const ratings = reviews.map((review: any) => review.rating);
        const totalRating = ratings.reduce((sum: number, rating: number) => sum + rating, 0);
        const average = totalRating / reviews.length;

        return Math.round(average * 10) / 10;
    }, [reviewsResponse]);

    const handleEditProfile = useCallback(() => {
        router.push('/workspace/profile');
    }, [router]);

    const handleViewCalendar = useCallback(() => {
        router.push('/workspace/calendar');
    }, [router]);

    const getDisplayName = useCallback(() => {
        if (session?.user?.name) {
            return session.user.name;
        }
        return isCoach ? 'Coach' : 'Student';
    }, [session?.user?.name, isCoach]);

    const formatRoles = useCallback(() => {
        if (!roles || roles.length === 0) return [];

        // Filter out visitor and student roles, then capitalize first letter of each role
        return roles
            .filter(role => role !== 'visitor' && role !== 'student')
            .map(role => role.charAt(0).toUpperCase() + role.slice(1));
    }, [roles]);

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
                                router.push('/workspace');
                            },
                        },
                        {
                            label: breadcrumbsTranslations('dashboard'),
                            onClick: () => {
                                // Nothing should happen on clicking the current page
                            },
                        },
                    ]}
                />
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center space-x-4">
                        <UserAvatar
                            size="xLarge"
                            imageUrl={session?.user?.image ?? undefined}
                            fullName={getDisplayName()}
                        />
                        <div className="flex flex-col space-y-2">
                            <h1>
                                 {getDisplayName()}
                            </h1>
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
                                        iconLeft={<IconStar className="w-3 h-3"/>}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            hasIconLeft
                            iconLeft={<IconEdit/>}
                            size="medium"
                            onClick={handleEditProfile}
                        >
                            {t('editProfile')}
                        </Button>
                        <Button
                            variant="primary"
                            hasIconLeft
                            iconLeft={<IconCalendar/>}
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
                            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                                <h3> {t('yourCourses')} </h3>
                                {isAdmin && <CreateCourseDialog />}
                            </div>
                            <UserCoursesList />
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
                            <UserCoursesList />
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