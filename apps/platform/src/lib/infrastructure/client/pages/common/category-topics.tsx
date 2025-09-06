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

    // Validation and derived state
    const isViewModelValid =
        topicsByCategoryViewModel &&
        topicsByCategoryViewModel.mode === 'default';

    const categories = useMemo(() => {
        if (!isViewModelValid) return [];
        return topicsByCategoryViewModel.data.categories.map((c) => c.name);
    }, [isViewModelValid, topicsByCategoryViewModel]);

    const allTopics = useMemo(() => {
        if (!isViewModelValid) return [];

        const topics = Object.values(
            topicsByCategoryViewModel.data.categories,
        ).reduce<Set<viewModels.TMatrixTopic>>((acc, category) => {
            category.topics.forEach((topic) => {
                acc.add(topic);
            });
            return acc;
        }, new Set<viewModels.TMatrixTopic>());
        return Array.from(topics);
    }, [isViewModelValid, topicsByCategoryViewModel]);

    // URL synchronization
    // TODO: Validate whether this is truly necessary
    useEffect(() => {
        const url = new URL(window.location.toString());
        url.searchParams.set('topics', selectedTopics.join(','));
        window.history.pushState({}, '', url);
    }, [selectedTopics]);

    // Loading state
    if (!topicsByCategoryViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error state
    if (topicsByCategoryViewModel.mode === 'kaboom') {
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
