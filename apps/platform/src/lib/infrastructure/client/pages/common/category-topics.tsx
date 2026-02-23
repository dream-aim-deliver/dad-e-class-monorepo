import { viewModels } from '@maany_shr/e-class-models';
import { useListTopicsByCategoryPresenter } from '../../hooks/use-list-topics-by-category-presenter';
import { useListTopicsPresenter } from '../../hooks/use-list-topics-presenter';
import { useListCategoriesPresenter } from '../../hooks/use-categories-presenter';
import { trpc } from '../../trpc/cms-client';
import { useEffect, useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    FilterSwitch,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

const CONTENT_CLASS_NAME = 'mt-8';

interface CategoryTopicsProps {
    selectedTopics: string[];
    setSelectedTopics: (selectedTopics: string[]) => void;
    filterText: string;
    chooseCategoryText: string;
}

export default function CategoryTopics({
    selectedTopics,
    setSelectedTopics,
    filterText,
    chooseCategoryText,
}: CategoryTopicsProps) {
    const locale = useLocale() as TLocale;
    const categoryTopicsTranslations = useTranslations('pages.categoryTopics');

    // Data fetching and presentation logic
    // Fetch categories independently
    const [categoriesResponse] = trpc.listCategories.useSuspenseQuery({});
    const [categoriesViewModel, setCategoriesViewModel] = useState<
        viewModels.TCategoryListViewModel | undefined
    >(undefined);
    const { presenter: categoriesPresenter } = useListCategoriesPresenter(
        setCategoriesViewModel,
    );

    // Fetch topics by category for relationship mapping
    const [topicsByCategoryResponse] =
        trpc.listTopicsByCategory.useSuspenseQuery({});
    const [topicsByCategoryViewModel, setTopicsByCategoryViewModel] = useState<
        viewModels.TListTopicsByCategoryViewModel | undefined
    >(undefined);
    const { presenter } = useListTopicsByCategoryPresenter(
        setTopicsByCategoryViewModel,
    );
    
    // Fetch all topics
    const [topicsResponse] = trpc.listTopics.useSuspenseQuery({});
    const [topicsViewModel, setTopicsViewModel] = useState<
        viewModels.TListTopicsViewModel | undefined
    >(undefined);
    const { presenter: topicsPresenter } =
        useListTopicsPresenter(setTopicsViewModel);

    // Present data using useEffect to prevent render loops
    useEffect(() => {
        if (categoriesResponse.success === true) {
            // @ts-ignore - tRPC response structure compatibility issue
            categoriesPresenter.present(categoriesResponse, categoriesViewModel);
        }
    }, [categoriesResponse, categoriesPresenter, categoriesViewModel]);

    useEffect(() => {
        if (topicsByCategoryResponse.success === true) {
            // @ts-ignore - tRPC response structure compatibility issue
            presenter.present(topicsByCategoryResponse, topicsByCategoryViewModel);
        }
    }, [topicsByCategoryResponse, presenter, topicsByCategoryViewModel]);

    useEffect(() => {
        if (topicsResponse.success === true) {
            // @ts-ignore - tRPC response structure compatibility issue  
            topicsPresenter.present(topicsResponse, topicsViewModel);
        }
    }, [topicsResponse, topicsPresenter, topicsViewModel]);

    // Validation and derived state
    const isCategoriesViewModelValid =
        categoriesViewModel &&
        categoriesViewModel.mode === 'default'; 
    
    const isMapViewModelValid =
        topicsByCategoryViewModel &&
        topicsByCategoryViewModel.mode === 'default';

    const isTopicsViewModelValid =
        topicsViewModel && 
        topicsViewModel.mode === 'default';  

    // Get categories from listCategories (independent of topics)
    const categories = useMemo(() => {
        if (!isCategoriesViewModelValid) return [];
        return (categoriesViewModel.data.categories ?? []).map((c) => c.name);
    }, [isCategoriesViewModelValid, categoriesViewModel]);

    // Create a map of category name to topics for relationship logic
    const categoryToTopicsMap = useMemo(() => {
        if (!isMapViewModelValid) return new Map<string, viewModels.TMatrixTopic[]>();
        const map = new Map<string, viewModels.TMatrixTopic[]>();
        for (const category of (topicsByCategoryViewModel.data.categories ?? [])) {
            const seen = new Set<string>();
            const uniqueTopics = (category.topics ?? []).filter((topic) => {
                if (seen.has(topic.slug)) return false;
                seen.add(topic.slug);
                return true;
            });
            map.set(category.name, uniqueTopics);
        }
        return map;
    }, [isMapViewModelValid, topicsByCategoryViewModel]);

    const allTopics = useMemo(() => {
        if (!isMapViewModelValid || !isTopicsViewModelValid) return [];

        const existingSlugs = new Set<string>();
        const topics: viewModels.TMatrixTopic[] = [];

        for (const category of (topicsByCategoryViewModel.data.categories ?? [])) {
            for (const topic of (category.topics ?? [])) {
                if (!existingSlugs.has(topic.slug)) {
                    topics.push(topic);
                    existingSlugs.add(topic.slug);
                }
            }
        }

        for (const topic of (topicsViewModel.data.topics ?? [])) {
            if (!existingSlugs.has(topic.slug)) {
                topics.push({
                    name: topic.name,
                    slug: topic.slug,
                });
                existingSlugs.add(topic.slug);
            }
        }

        return topics;
    }, [
        isMapViewModelValid,
        isTopicsViewModelValid,
        topicsByCategoryViewModel,
        topicsViewModel,
    ]);

    // URL synchronization
    useEffect(() => {
        const url = new URL(window.location.toString());
        url.searchParams.set('topics', selectedTopics.join(','));
        window.history.pushState({}, '', url);
    }, [selectedTopics]);

    // Loading state
    if (!categoriesViewModel || !topicsByCategoryViewModel || !topicsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error state
    if (
        categoriesViewModel.mode === 'kaboom' ||
        topicsByCategoryViewModel.mode === 'kaboom' ||
        topicsViewModel.mode === 'kaboom'
    ) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={categoryTopicsTranslations('error.title')}
                description={categoryTopicsTranslations('error.description')}
            />
        );
    }

    // Note: There is no 'not-found' mode in these view models
    // They only have 'default' and 'kaboom' modes
    // Empty state is handled in the UI when arrays are empty

    // Event handlers
    const handleTabChange = () => {
        setSelectedTopics([]);
    };

    // Render helpers
    const renderCategoryTab = (
        category: string,
        index: number,
        totalLength: number,
    ) => (
        <Tabs.Trigger
            value={category}
            key={category}
            isLast={index === totalLength - 1} // Last tab without divider
        >
            {category}
        </Tabs.Trigger>
    );

    const renderCategoryContent = (category: string) => {
        // Get topics for this category from the relationship map
        const topics = categoryToTopicsMap.get(category) || [];

        return (
            <Tabs.Content
                value={category}
                key={category}
                className={CONTENT_CLASS_NAME}
            >
                {topics.length === 0 ? (
                    <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                        <p className="text-text-secondary text-md">
                            {categoryTopicsTranslations('noTopicsFound')}
                        </p>
                    </div>
                ) : (
                    <FilterSwitch
                        selectedTopics={selectedTopics}
                        setSelectedTopics={setSelectedTopics}
                        title={filterText}
                        list={topics}
                    />
                )}
            </Tabs.Content>
        );
    };

    if (categories.length === 0 && allTopics.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <h2>{chooseCategoryText}</h2>
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-secondary text-md">
                        {categoryTopicsTranslations('noTopicsFound')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2>{chooseCategoryText}</h2>
            <Tabs.Root defaultTab="all" onValueChange={handleTabChange}>
                <Tabs.List>
                    <Tabs.Trigger value="all" isLast={categories.length === 0}>
                        {categoryTopicsTranslations('allText')}
                    </Tabs.Trigger>
                    {categories.map((category, index) =>
                        renderCategoryTab(category, index, categories.length),
                    )}
                </Tabs.List>

                <Tabs.Content value="all" className={CONTENT_CLASS_NAME}>
                    {allTopics.length === 0 ? (
                        <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                            <p className="text-text-secondary text-md">
                                {categoryTopicsTranslations('noTopicsFound')}
                            </p>
                        </div>
                    ) : (
                        <FilterSwitch
                            selectedTopics={selectedTopics}
                            setSelectedTopics={setSelectedTopics}
                            title={filterText}
                            list={allTopics}
                        />
                    )}
                </Tabs.Content>

                {categories.map(renderCategoryContent)}
            </Tabs.Root>
        </div>
    );
}
