'use client';

import { useMemo, useState, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListUserCoursesPresenter } from '../../hooks/use-list-user-courses-presenter';
import { useSession } from 'next-auth/react';

import {
    Button,
    CardListLayout,
    CoachCourseCard,
    CourseCreatorCard,
    CourseStatus,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    StudentCourseCard,
    ReviewDialog,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import useClientSidePagination from '../../utils/use-client-side-pagination';
import { useRouter } from 'next/navigation';

import { getAuthorDisplayName } from '../../utils/get-author-display-name';
import { trpc } from '../../trpc/cms-client';

interface UserCoursesListProps {
    maxItems?: number;
}

export default function UserCoursesList({ maxItems }: UserCoursesListProps = {}) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const sessionStatus = sessionDTO.status;
    const emptyStateTranslations = useTranslations('pages.userCoursesList');
    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    // State for review modal - declared early to avoid conditional hook calls
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedCourseForReview, setSelectedCourseForReview] = useState<{
        courseSlug: string;
        courseTitle: string;
    } | null>(null);
    const [reviewErrorMessage, setReviewErrorMessage] = useState<string | undefined>(undefined);

    const utils = trpc.useUtils();

    // TRPC mutation for creating review
    const createReviewMutation = trpc.createCourseReview.useMutation({
        onMutate: () => {
            setReviewErrorMessage(undefined);
        },
        onSuccess: () => {
            setReviewErrorMessage(undefined);
            setReviewModalOpen(false);
            setSelectedCourseForReview(null);
            // Invalidate queries to refresh course list
            utils.listUserCourses.invalidate({});
        },
        onError: (error) => {
            setReviewErrorMessage(error.message);
        }
    });

    // Handle authentication redirect in useEffect to prevent infinite re-renders
    useEffect(() => {
        if (sessionStatus !== 'authenticated' || session == null) {
            router.push('/auth/login');
        }
    }, [sessionStatus, session, router]);
    const userRoles = session?.user.roles;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isAdmin = userRoles?.includes('admin');
    const [coursesResponse] = trpc.listUserCourses.useSuspenseQuery({});
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TListUserCoursesViewModel | undefined
    >(undefined);
    const { presenter } = useListUserCoursesPresenter(setCoursesViewModel);

    // Present data when available
    useEffect(() => {
        if (coursesResponse && presenter) {
            // @ts-ignore
            presenter.present(coursesResponse, coursesViewModel);
        }
    }, [coursesResponse, presenter]);

    const courses = useMemo(() => {
        if (!coursesViewModel || coursesViewModel.mode !== 'default' || !coursesViewModel.data) {
            return [];
        }
        return coursesViewModel.data.courses || [];
    }, [coursesViewModel]);

    const {
        displayedItems: displayedCourses,
        hasMoreItems: hasMoreCourses,
        handleLoadMore,
    } = useClientSidePagination({
        items: courses,
    });

    // If maxItems is specified, limit the displayed courses
    const limitedCourses = maxItems ? displayedCourses.slice(0, maxItems) : displayedCourses;
    const showLoadMore = maxItems ? false : hasMoreCourses;

    if (!coursesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coursesViewModel.mode === 'not-found') {
        return <DefaultNotFound locale={locale} />;
    }

    if (coursesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (limitedCourses.length === 0) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                <p className="text-text-primary text-md">
                    {emptyStateTranslations('emptyState')}
                </p>
            </div>
        );
    }

    const onCourseVisit = (courseSlug: string) => {
        router.push(`/courses/${courseSlug}`);
    };

    const onCourseEdit = (courseSlug: string) => {
        router.push(`/edit/course/${courseSlug}`);
    };

    const onClickUser = (username: string) => {
        router.push(`/coaches/${username}`);
    };

    const onReviewCourse = (courseSlug: string, courseTitle: string) => {
        setSelectedCourseForReview({ courseSlug, courseTitle });
        setReviewModalOpen(true);
    };

    const handleReviewSubmit = (rating: number, review: string) => {
        if (!selectedCourseForReview) return;

        createReviewMutation.mutate({
            courseSlug: selectedCourseForReview.courseSlug,
            rating,
            review,
        });
    };

    return (
        <div className="flex flex-col space-y-2 mt-6 pb-15">
            <CardListLayout>
                {limitedCourses.map((course: viewModels.TListUserCoursesSuccess['courses'][number]) => {
                    // Leaving some fields empty as neither response provides them, nor the view uses them

                    const language = {
                        code: '',
                        name: course.language,
                    };
                    const author = {
                        name: getAuthorDisplayName(
                            course.author?.name || null,
                            course.author?.surname || null,
                            locale,
                        ),
                        username: course.author?.username || '',
                        image: course.author?.avatarUrl ?? undefined,
                    };
                    const duration = {
                        selfStudy: course.fullDuration,
                        video: 0,
                        coaching: 0,
                    };
                    const pricing = {
                        partialPrice: 0,
                        currency: '',
                        fullPrice: 0,
                    };
                    if (course.role === 'course_creator') {
                        const stateToStatus: Record<string, CourseStatus> = {
                            draft: 'draft',
                            live: 'live',
                            archived: 'archived',
                        };
                        return (
                            <CourseCreatorCard
                                key={course.id}
                                rating={course.averageRating ?? 0}
                                reviewCount={course.reviewCount ?? 0}
                                sessions={course.coachingSessionCount ?? 0}
                                sales={course.salesCount ?? 0}
                                // TODO: get rid of this mapping once ui-kit is updated
                                status={stateToStatus[course.status || 'draft'] || 'draft'}
                                locale={locale}
                                title={course.title || ''}
                                description={course.description || ''}
                                imageUrl={course.imageUrl ?? ''}
                                author={author}
                                language={language}
                                duration={duration}
                                pricing={pricing}
                                onClickUser={() =>
                                    onClickUser(course.author?.username || '')
                                }
                                onEdit={() => onCourseEdit(course.slug || '')}
                                onGoToOffer={() => onCourseVisit(course.slug || '')}
                            />
                        );
                    }
                    if (course.role === 'coach') {
                        return (
                            <CoachCourseCard
                                key={course.id}
                                title={course.title || ''}
                                reviewCount={course.reviewCount ?? 0}
                                sessions={course.coachingSessionCount ?? 0}
                                sales={course.salesCount ?? 0}
                                locale={locale}
                                language={language}
                                imageUrl={course.imageUrl ?? ''}
                                author={author}
                                duration={duration}
                                rating={course.averageRating ?? 0}
                                onManage={() => onCourseVisit(course.slug || '')}
                                onClickUser={() =>
                                    onClickUser(course.author?.username || '')
                                }
                            />
                        );
                    }
                    if (course.role === 'student') {
                        return (
                            <StudentCourseCard
                                key={course.id}
                                locale={locale}
                                sales={course.salesCount ?? 0}
                                reviewCount={course.reviewCount ?? 0}
                                title={course.title || ''}
                                description={course.description || ''}
                                language={language}
                                imageUrl={course.imageUrl ?? ''}
                                author={author}
                                pricing={pricing}
                                duration={duration}
                                rating={course.averageRating ?? 0}
                                progress={course.progress ?? 0}
                                onBegin={() => onCourseVisit(course.slug || '')}
                                onResume={() => onCourseVisit(course.slug || '')}
                                onReview={() => onReviewCourse(course.slug || '', course.title || '')}
                                onDetails={() => onCourseVisit(course.slug || '')}
                                onClickUser={() =>
                                    onClickUser(course.author?.username || '')
                                }
                            />
                        );
                    }
                })}
            </CardListLayout>
            {showLoadMore && (
                <Button
                    variant="text"
                    text={paginationTranslations('loadMore')}
                    onClick={handleLoadMore}
                    size="medium"
                    className="pt-10"
                />
            )}

            {/* Review Modal */}
            {selectedCourseForReview && (
                <ReviewDialog
                    isOpen={reviewModalOpen}
                    onOpenChange={setReviewModalOpen}
                    modalType="course"
                    onSubmit={handleReviewSubmit}
                    onClose={() => setReviewModalOpen(false)}
                    locale={locale}
                    isLoading={createReviewMutation.isPending}
                    isError={createReviewMutation.isError}
                    errorMessage={reviewErrorMessage}
                />
            )}
        </div>
    );
}
