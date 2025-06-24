import {
    Button,
    CardListLayout,
    CheckBox,
    DefaultError,
    DefaultLoading,
    SectionHeading,
    VisitorCourseCard,
} from '@maany_shr/e-class-ui-kit';
import { useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../trpc/client';
import { useListCoursesPresenter } from '../../hooks/use-courses-presenter';

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
            <SectionHeading text={t('ourCourses')} />
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

const COURSES_PER_PAGE = 6;

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
    const [displayedCount, setDisplayedCount] = useState(COURSES_PER_PAGE);
    const t = useTranslations('components.paginationButton');

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

    const displayedCourses = useMemo(() => {
        return courses.slice(0, displayedCount);
    }, [courses, displayedCount]);

    const hasMoreCourses = displayedCount < courses.length;

    const handleLoadMore = () => {
        setDisplayedCount((prev) => Math.min(prev + 6, courses.length));
    };

    // Validation and derived state
    if (!coursesViewModel) {
        return <DefaultLoading />;
    }

    // TODO: Improve not found state display
    if (
        coursesViewModel.mode === 'not-found' ||
        displayedCourses.length === 0
    ) {
        return <DefaultError errorMessage="No courses found" />;
    }

    if (coursesViewModel.mode !== 'default') {
        return <DefaultError errorMessage={coursesViewModel.data.message} />;
    }

    return (
        <div className="flex flex-col justify-center space-y-4">
            <CardListLayout>
                {displayedCourses.map((course) => {
                    return (
                        <VisitorCourseCard
                            coachingIncluded={coachingIncluded}
                            onDetails={() => {
                                // TODO: Implement course details navigation
                            }}
                            onBuy={() => {
                                // TODO: Implement course purchase navigation
                            }}
                            onClickUser={() => {
                                // TODO: Implement user profile navigation
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
                                name:
                                    course.author.name +
                                    ' ' +
                                    course.author.surname,
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
                    text={t('loadMore')}
                    onClick={handleLoadMore}
                />
            )}
        </div>
    );
}
