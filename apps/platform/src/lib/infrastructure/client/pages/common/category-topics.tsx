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
import { useLocale } from 'next-intl';
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

    // Loading state
    if (!topicsByCategoryViewModel) {
        return <DefaultLoading locale={locale} />;
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
                    title={filterText}
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
                    title={filterText}
                    list={allTopics}
                />
            </Tabs.Content>

            {categories.map(renderCategoryContent)}
        </Tabs.Root>
    );
}
