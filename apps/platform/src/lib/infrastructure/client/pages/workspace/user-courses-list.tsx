'use client';

import { useMemo, useState } from 'react';
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
import { trpc } from '../../trpc/cms-client';

export default function UserCoursesList() {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const sessionStatus = sessionDTO.status;
    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );
    if (sessionStatus !== 'authenticated' || session == null) {
        // redirect to login page
        router.push('/auth/login');
    }
    const userRoles = session?.user.roles;
    const isAdmin = userRoles?.includes('admin');
    const [coursesResponse] = trpc.listUserCourses.useSuspenseQuery({});
    console.log(coursesResponse);
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TUserCourseListViewModel | undefined
    >(undefined);
    const { presenter } = useListUserCoursesPresenter(setCoursesViewModel);
    // @ts-ignore
    presenter.present(coursesResponse, coursesViewModel);

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
        return <DefaultNotFound locale={locale} />;
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
                        name: '',
                        image: '',
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
                    if (course.role === 'course_creator' || isAdmin) {
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
