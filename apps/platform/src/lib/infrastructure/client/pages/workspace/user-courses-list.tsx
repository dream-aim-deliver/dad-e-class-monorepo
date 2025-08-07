'use client';

import { useMemo, useState } from 'react';
import { trpc } from '../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListUserCoursesPresenter } from '../../hooks/use-user-courses-presenter';
import {
    Button,
    CardListLayout,
    CoachCourseCard,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import useClientSidePagination from '../../utils/use-client-side-pagination';

export default function UserCoursesList() {
    const locale = useLocale() as TLocale;
    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    const [coursesResponse] = trpc.listUserCourses.useSuspenseQuery({});
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TUserCourseListViewModel | undefined
    >(undefined);
    const { presenter } = useListUserCoursesPresenter(setCoursesViewModel);
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
        return <DefaultLoading locale={locale} />;
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

    return (
        <div className="flex flex-col space-y-2">
            <CardListLayout>
                {displayedCourses.map((course) => {
                    if (course.role === 'coach') {
                        return (
                            <CoachCourseCard
                                key={course.id}
                                title={course.title}
                                reviewCount={course.reviewCount}
                                sessions={course.coachingSessionCount ?? 0}
                                sales={course.salesCount}
                                locale={locale}
                                language={{
                                    code: '',
                                    name: course.language,
                                }}
                                imageUrl={course.imageUrl ?? ''}
                                author={{
                                    name:
                                        course.author.name +
                                        ' ' +
                                        course.author.surname,
                                    image: course.author.avatarUrl ?? '',
                                }}
                                duration={{
                                    selfStudy: course.fullDuration,
                                    video: 0,
                                    coaching: 0,
                                }}
                                rating={course.averageRating}
                            />
                        );
                    }
                    return <div key={course.id}>Mock</div>;
                })}
            </CardListLayout>
            {hasMoreCourses && (
                <Button
                    variant="text"
                    text={paginationTranslations('loadMore')}
                    onClick={handleLoadMore}
                />
            )}
        </div>
    );
}
