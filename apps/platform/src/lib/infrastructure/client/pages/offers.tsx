'use client';

import {
    DefaultError,
    DefaultLoading,
    FilterSwitch,
    Outline,
    SectionHeading,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../trpc/client';
import { useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../hooks/use-offers-page-outline-presenter';
import { useGetTopicsByCategoryPresenter } from '../hooks/use-topics-by-category-presenter';
import { useTranslations } from 'next-intl';

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
        </div>
    );
}
