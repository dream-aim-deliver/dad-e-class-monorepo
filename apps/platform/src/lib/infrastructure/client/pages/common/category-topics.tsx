import { viewModels } from '@maany_shr/e-class-models';
import { useListTopicsByCategoryPresenter } from '../../hooks/use-topics-by-category-presenter';
import { trpc } from '../../trpc/client';
import { useEffect, useMemo, useState } from 'react';
import {
    DefaultError,
    DefaultLoading,
    FilterSwitch,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListTopicsPresenter } from '../../hooks/use-topics-presenter';

const CONTENT_CLASS_NAME = 'mt-8';

interface CategoryTopicsProps {
    selectedTopics: string[];
    setSelectedTopics: (selectedTopics: string[]) => void;
    filterText: string;
}

export default function CategoryTopics({
    selectedTopics,
    setSelectedTopics,
    filterText,
}: CategoryTopicsProps) {
    const locale = useLocale() as TLocale;
    const categoryTopicsTranslations = useTranslations('pages.categoryTopics');

    // Data fetching and presentation logic
    const [topicsByCategoryResponse] =
        trpc.listTopicsByCategory.useSuspenseQuery({});
    const [topicsByCategoryViewModel, setTopicsByCategoryViewModel] = useState<
        viewModels.TTopicsByCategoryViewModel | undefined
    >(undefined);

    const { presenter } = useListTopicsByCategoryPresenter(
        setTopicsByCategoryViewModel,
    );
    presenter.present(topicsByCategoryResponse, topicsByCategoryViewModel);

    const [topicsResponse] = trpc.listTopics.useSuspenseQuery({});
    const [topicsViewModel, setTopicsViewModel] = useState<
        viewModels.TTopicListViewModel | undefined
    >(undefined);
    const { presenter: topicsPresenter } =
        useListTopicsPresenter(setTopicsViewModel);
    topicsPresenter.present(topicsResponse, topicsViewModel);

    // Validation and derived state
    const isMapViewModelValid =
        topicsByCategoryViewModel &&
        topicsByCategoryViewModel.mode === 'default';

    const isTopicsViewModelValid =
        topicsViewModel && topicsViewModel.mode === 'default';

    const categories = useMemo(() => {
        if (!isMapViewModelValid) return [];
        return topicsByCategoryViewModel.data.categories.map((c) => c.name);
    }, [isMapViewModelValid, topicsByCategoryViewModel]);

    const allTopics = useMemo(() => {
        if (!isMapViewModelValid || !isTopicsViewModelValid) return [];

        const existingSlugs = new Set<string>();
        const topics: viewModels.TMatrixTopic[] = [];

        for (const category of Object.values(
            topicsByCategoryViewModel.data.categories,
        )) {
            for (const topic of category.topics) {
                if (!existingSlugs.has(topic.slug)) {
                    topics.push(topic);
                    existingSlugs.add(topic.slug);
                }
            }
        }

        for (const topic of topicsViewModel.data.topics) {
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
    // TODO: Validate whether this is truly necessary
    useEffect(() => {
        const url = new URL(window.location.toString());
        url.searchParams.set('topics', selectedTopics.join(','));
        window.history.pushState({}, '', url);
    }, [selectedTopics]);

    // Loading state
    if (!topicsByCategoryViewModel || !topicsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error state
    if (
        topicsByCategoryViewModel.mode === 'kaboom' ||
        topicsViewModel.mode === 'kaboom'
    ) {
        return <DefaultError locale={locale} />;
    }

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
        const categoryItem = topicsByCategoryViewModel.data.categories.find(
            (c) => c.name === category,
        );
        if (!categoryItem) return null;
        const topics = categoryItem.topics || [];

        return (
            <Tabs.Content
                value={category}
                key={category}
                className={CONTENT_CLASS_NAME}
            >
                <FilterSwitch
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    title={filterText}
                    list={topics}
                />
            </Tabs.Content>
        );
    };
    return (
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
                <FilterSwitch
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    title={filterText}
                    list={allTopics}
                />
            </Tabs.Content>

            {categories.map(renderCategoryContent)}
        </Tabs.Root>
    );
}
