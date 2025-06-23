'use client';

import {
    Button,
    CardListLayout,
    CheckBox,
    CourseCardListSkeleton,
    DefaultError,
    DefaultLoading,
    Divider,
    FilterSwitch,
    Outline,
    SectionHeading,
    Tabs,
    VisitorCourseCard,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../trpc/client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../hooks/use-offers-page-outline-presenter';
import { useGetTopicsByCategoryPresenter } from '../hooks/use-topics-by-category-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { useGetCoursesPresenter } from '../hooks/use-courses-presenter';
import { TLocale } from '@maany_shr/e-class-translations';

interface OffersFiltersProps {
    selectedTopics: string[];
    setSelectedTopics: (selectedTopics: string[]) => void;
}

function OffersFilters({
    selectedTopics,
    setSelectedTopics,
}: OffersFiltersProps) {
    // Data fetching and presentation logic
    const [topicsByCategoryResponse] =
        trpc.getTopicsByCategory.useSuspenseQuery({});
    const [topicsByCategoryViewModel, setTopicsByCategoryViewModel] = useState<
        viewModels.TTopicsByCategoryViewModel | undefined
    >(undefined);

    const { presenter } = useGetTopicsByCategoryPresenter(
        setTopicsByCategoryViewModel,
    );
    presenter.present(topicsByCategoryResponse, topicsByCategoryViewModel);

    // Validation and derived state
    const isViewModelValid =
        topicsByCategoryViewModel &&
        topicsByCategoryViewModel.mode === 'default';

    const categories = useMemo(() => {
        if (!isViewModelValid) return [];
        return Object.keys(topicsByCategoryViewModel.data.topicsByCategory);
    }, [isViewModelValid, topicsByCategoryViewModel]);

    const allTopics = useMemo(() => {
        if (!isViewModelValid) return [];

        return Object.values(topicsByCategoryViewModel.data.topicsByCategory)
            .flat()
            .reduce<viewModels.TMatrixTopic[]>((acc, topic) => {
                const isTopicAlreadyAdded = acc.find(
                    (t) => t.slug === topic.slug,
                );
                if (!isTopicAlreadyAdded) {
                    acc.push(topic);
                }
                return acc;
            }, []);
    }, [isViewModelValid, topicsByCategoryViewModel]);

    // URL synchronization
    // TODO: Validate whether this is truly necessary
    useEffect(() => {
        const url = new URL(window.location.toString());
        url.searchParams.set('topics', selectedTopics.join(','));
        window.history.pushState({}, '', url);
    }, [selectedTopics]);

    const t = useTranslations('pages.offers');

    // Loading state
    if (!topicsByCategoryViewModel) {
        return <DefaultLoading />;
    }

    // Error state
    if (topicsByCategoryViewModel.mode !== 'default') {
        return (
            <DefaultError
                errorMessage={topicsByCategoryViewModel.data.message}
            />
        );
    }

    // Event handlers
    const handleTabChange = () => {
        setSelectedTopics([]);
    };

    // Constants
    const CONTENT_CLASS_NAME = 'mt-8';

    // Render helpers
    const renderCategoryTab = (category: string) => (
        <Tabs.Trigger value={category} key={category}>
            {category}
        </Tabs.Trigger>
    );

    const renderCategoryContent = (category: string) => {
        const topics =
            topicsByCategoryViewModel.data.topicsByCategory[category];

        return (
            <Tabs.Content
                value={category}
                key={category}
                className={CONTENT_CLASS_NAME}
            >
                <FilterSwitch
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    title={t('filterByTopic')}
                    list={topics}
                />
            </Tabs.Content>
        );
    };

    return (
        <Tabs.Root defaultTab="all" onValueChange={handleTabChange}>
            <Tabs.List>
                <Tabs.Trigger value="all">All</Tabs.Trigger>
                {categories.map(renderCategoryTab)}
            </Tabs.List>

            <Tabs.Content value="all" className={CONTENT_CLASS_NAME}>
                <FilterSwitch
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    title={t('filterByTopic')}
                    list={allTopics}
                />
            </Tabs.Content>

            {categories.map(renderCategoryContent)}
        </Tabs.Root>
    );
}

interface CourseListProps {
    selectedTopics: string[];
    coachingIncluded: boolean;
}

const COURSES_PER_PAGE = 6;

function CourseList({ selectedTopics, coachingIncluded }: CourseListProps) {
    const [coursesResponse] = trpc.getCourses.useSuspenseQuery({});
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TCourseListViewModel | undefined
    >(undefined);
    const { presenter } = useGetCoursesPresenter(setCoursesViewModel);
    presenter.present(coursesResponse, coursesViewModel);
    const locale = useLocale() as TLocale;
    const [displayedCount, setDisplayedCount] = useState(COURSES_PER_PAGE);

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
                            key={course.id}
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
                    text="Load More..."
                    onClick={handleLoadMore}
                />
            )}
        </div>
    );
}

interface OffersProps {
    initialSelectedTopics?: string[];
}

export default function Offers(props: OffersProps) {
    // Data fetching and presentation logic
    const [outlineResponse] = trpc.getOffersPageOutline.useSuspenseQuery({});
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TOffersPageOutlineViewModel | undefined
    >(undefined);

    const { presenter } = useGetOffersPageOutlinePresenter(setOutlineViewModel);
    presenter.present(outlineResponse, outlineViewModel);

    const t = useTranslations('pages.offers');

    // Filter
    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        props.initialSelectedTopics ?? [],
    );
    const [coachingIncluded, setCoachingIncluded] = useState<boolean>(false);

    // Loading state
    if (!outlineViewModel) {
        return <DefaultLoading />;
    }

    // Error state
    if (outlineViewModel.mode === 'kaboom') {
        return <DefaultError errorMessage={outlineViewModel.data.message} />;
    }

    const outline = outlineViewModel.data;

    return (
        <div className="flex flex-col space-y-5">
            <Outline title={outline.title} description={outline.description} />
            <SectionHeading text={t('chooseCategory')} />
            <OffersFilters
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
            />
            <Divider className="my-12" />
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
            <Suspense fallback={<CourseCardListSkeleton />}>
                <CourseList
                    selectedTopics={selectedTopics}
                    coachingIncluded={coachingIncluded}
                />
            </Suspense>
        </div>
    );
}
