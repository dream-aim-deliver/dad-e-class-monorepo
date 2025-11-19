import {
    Button,
    CardListLayout,
    CheckBox,
    DefaultError,
    DefaultLoading,
    EmptyState,
    VisitorCourseCard,
} from '@maany_shr/e-class-ui-kit';
import { useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../trpc/client';
import { useListCoursesPresenter } from '../../hooks/use-list-courses-presenter';
import { useRouter } from 'next/navigation';
import useClientSidePagination from '../../utils/use-client-side-pagination';
import { getAuthorDisplayName } from '../../utils/get-author-display-name';

interface OffersCourseHeadingProps {
    coachingIncluded: boolean;
    setCoachingIncluded: (value: boolean) => void;
}

export function OffersCourseHeading({
    coachingIncluded,
    setCoachingIncluded,
}: OffersCourseHeadingProps) {
    const t = useTranslations('pages.offers');

    return (
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between w-full">
            <h2> {t('ourCourses')} </h2>
            <CheckBox
                name="coaching-filter"
                value="coaching-included"
                checked={coachingIncluded}
                onChange={() => setCoachingIncluded(!coachingIncluded)}
                withText
                label={t('coachingIncluded')}
                className="w-auto"
                labelClass="text-text-primary text-base"
            />
        </div>
    );
}

interface CourseListProps {
    selectedTopics: string[];
    coachingIncluded: boolean;
}

export function OffersCourseList({
    selectedTopics,
    coachingIncluded,
}: CourseListProps) {
    const [coursesResponse] = trpc.listCourses.useSuspenseQuery({});
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TCourseListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoursesPresenter(setCoursesViewModel);
    presenter.present(coursesResponse, coursesViewModel);
    const locale = useLocale() as TLocale;
    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );
    const offersTranslations = useTranslations('pages.offers');

    const router = useRouter();

    const courses = useMemo(() => {
        if (!coursesViewModel || coursesViewModel.mode !== 'default') {
            return [];
        }

        return coursesViewModel.data.courses.filter((course) => {
            const matchesTopics =
                selectedTopics.length === 0 ||
                course.topicSlugs.some((topic) =>
                    selectedTopics.includes(topic),
                );

            const matchesCoaching =
                !coachingIncluded || course.coachingSessionCount;

            return matchesTopics && matchesCoaching;
        });
    }, [coursesViewModel, selectedTopics, coachingIncluded]);

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

    if (
        coursesViewModel.mode === 'not-found' ||
        displayedCourses.length === 0
    ) {
        return (
            <EmptyState
                locale={locale}
                message={offersTranslations('coursesNotFound.description')}
            />
        );
    }

    if (coursesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col justify-center space-y-4">
            <CardListLayout>
                {displayedCourses.map((course) => {
                    return (
                        <VisitorCourseCard
                            coachingIncluded={coachingIncluded}
                            onDetails={() => {
                                router.push(`/courses/${course.slug}`);
                            }}
                            onBuy={() => {
                                router.push(`/checkout/${course.slug}`);
                            }}
                            onClickUser={() => {
                                router.push(
                                    `/coaches/${course.author.username}`,
                                );
                            }}
                            key={`course-${course.id}`}
                            reviewCount={course.reviewCount}
                            sessions={course.coachingSessionCount ?? 0}
                            sales={course.salesCount}
                            locale={locale}
                            title={course.title}
                            description={course.description}
                            language={{
                                code: '',
                                name: course.language,
                            }}
                            imageUrl={course.imageUrl ?? ''}
                            author={{
                                name: getAuthorDisplayName(
                                    course.author.name,
                                    course.author.surname,
                                    locale,
                                ),
                                image: course.author.avatarUrl ?? '',
                            }}
                            pricing={{
                                partialPrice: course.pricing.base,
                                currency: course.pricing.currency,
                                fullPrice: course.pricing.withCoaching ?? 0,
                            }}
                            duration={{
                                video: 0,
                                coaching: 0,
                                selfStudy: course.fullDuration,
                            }}
                            rating={course.averageRating ?? 0}
                        />
                    );
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
