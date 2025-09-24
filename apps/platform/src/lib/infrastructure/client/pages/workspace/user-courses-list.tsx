'use client';

import { useMemo, useState, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListUserCoursesPresenter } from '../../hooks/use-user-courses-presenter';
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
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import useClientSidePagination from '../../utils/use-client-side-pagination';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/client';
import { getAuthorDisplayName } from '../../utils/get-author-display-name';

export default function UserCoursesList() {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const sessionStatus = sessionDTO.status;
    const emptyStateTranslations = useTranslations('pages.userCoursesList');
    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );
    // Handle authentication redirect in useEffect to prevent infinite re-renders
    useEffect(() => {
        if (sessionStatus !== 'authenticated' || session == null) {
            router.push('/auth/login');
        }
    }, [sessionStatus, session, router]);
    const userRoles = session?.user.roles;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const isAdmin = userRoles?.includes('admin');
    const [coursesResponse] = trpc.listUserCourses.useSuspenseQuery({});
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TUserCourseListViewModel | undefined
    >(undefined);
    const { presenter } = useListUserCoursesPresenter(setCoursesViewModel);
    
    // Present data when available
    useEffect(() => {
        if (coursesResponse && presenter) {
            presenter.present(coursesResponse, coursesViewModel);
        }
    }, [coursesResponse, presenter, coursesViewModel]);

    const courses = useMemo(() => {
        if (!coursesViewModel || coursesViewModel.mode !== 'default') {
            return [];
        }
        return coursesViewModel.data.courses;
    }, [coursesViewModel]);

    const {
        displayedItems: displayedCourses,
        hasMoreItems: hasMoreCourses,
        handleLoadMore,
    } = useClientSidePagination({
        items: courses,
    });

    if (!coursesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coursesViewModel.mode === 'not-found') {
        return <DefaultNotFound locale={locale} />;
    }

    if (coursesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (displayedCourses.length === 0) {
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

    return (
        <div className="flex flex-col space-y-2 mt-6">
            <CardListLayout>
                {displayedCourses.map((course) => {
                    // Leaving some fields empty as neither response provides them, nor the view uses them

                    const language = {
                        code: '',
                        name: course.language,
                    };
                    const author = {
                        name: getAuthorDisplayName(
                            course.author.name,
                            course.author.surname,
                            locale,
                        ),
                        username: course.author.username,
                        image: course.author.avatarUrl ?? undefined,
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
                            review: 'under-review',
                            live: 'published',
                        };
                        return (
                            <CourseCreatorCard
                                key={course.id}
                                rating={course.averageRating}
                                reviewCount={course.reviewCount}
                                sessions={course.coachingSessionCount ?? 0}
                                sales={course.salesCount}
                                status={stateToStatus[course.state] || 'draft'}
                                locale={locale}
                                title={course.title}
                                description={course.description}
                                imageUrl={course.imageUrl ?? ''}
                                author={author}
                                language={language}
                                duration={duration}
                                pricing={pricing}
                                onClickUser={() =>
                                    onClickUser(course.author.username)
                                }
                                onManage={() => onCourseVisit(course.slug)}
                                onEdit={() => onCourseEdit(course.slug)}
                            />
                        );
                    }
                    if (course.role === 'coach') {
                        return (
                            <CoachCourseCard
                                key={course.id}
                                title={course.title}
                                reviewCount={course.reviewCount}
                                sessions={course.coachingSessionCount ?? 0}
                                sales={course.salesCount}
                                locale={locale}
                                language={language}
                                imageUrl={course.imageUrl ?? ''}
                                author={author}
                                duration={duration}
                                rating={course.averageRating}
                                onManage={() => onCourseVisit(course.slug)}
                                onClickUser={() =>
                                    onClickUser(course.author.username)
                                }
                            />
                        );
                    }
                    if (course.role === 'student') {
                        return (
                            <StudentCourseCard
                                key={course.id}
                                locale={locale}
                                sales={course.salesCount}
                                reviewCount={course.reviewCount}
                                title={course.title}
                                description={course.description}
                                language={language}
                                imageUrl={course.imageUrl ?? ''}
                                author={author}
                                pricing={pricing}
                                duration={duration}
                                rating={course.averageRating}
                                progress={course.progress}
                                onBegin={() => onCourseVisit(course.slug)}
                                onResume={() => onCourseVisit(course.slug)}
                                onClickUser={() =>
                                    onClickUser(course.author.username)
                                }
                            />
                        );
                    }
                })}
            </CardListLayout>
            {hasMoreCourses && (
                <Button
                    variant="text"
                    text={paginationTranslations('loadMore')}
                    onClick={handleLoadMore}
                    size="medium"
                    className="pt-10"
                />
            )}
        </div>
    );
}
