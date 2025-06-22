'use client';

import {
    DefaultError,
    DefaultLoading,
    FilterSwitch,
    Outline,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../trpc/client';
import { useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../hooks/use-offers-page-outline-presenter';
import { Tabs } from '@maany_shr/e-class-ui-kit';
import { useGetTopicsByCategoryPresenter } from '../hooks/use-topics-by-category-presenter';

interface OffersFiltersProps {
    initialSelectedTopics?: string[];
}

function OffersFilters(props: OffersFiltersProps) {
    const [topicsByCategoryResponse] =
        trpc.getTopicsByCategory.useSuspenseQuery({});
    const [topicsByCategoryViewModel, setTopicsByCategoryViewModel] = useState<
        viewModels.TTopicsByCategoryViewModel | undefined
    >(undefined);
    const { presenter } = useGetTopicsByCategoryPresenter(
        setTopicsByCategoryViewModel,
    );
    presenter.present(topicsByCategoryResponse, topicsByCategoryViewModel);

    const viewModelInvalid =
        !topicsByCategoryViewModel ||
        topicsByCategoryViewModel.mode !== 'default';

    const categories = useMemo(() => {
        if (viewModelInvalid) return [];
        return Object.keys(topicsByCategoryViewModel.data.topicsByCategory);
    }, [topicsByCategoryViewModel]);

    const allTopics = useMemo(() => {
        if (viewModelInvalid) return [];
        return Object.values(topicsByCategoryViewModel.data.topicsByCategory)
            .flat()
            .reduce<viewModels.TMatrixTopic[]>((acc, topic) => {
                if (!acc.find((t) => t.slug === topic.slug)) {
                    acc.push(topic);
                }
                return acc;
            }, []);
    }, [topicsByCategoryViewModel]);

    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        props.initialSelectedTopics ?? [],
    );

    // TODO: Validate whether this is truly necessary
    useEffect(() => {
        const url = new URL(window.location.toString());
        url.searchParams.set('topics', selectedTopics.join(','));
        // Update URL without page reload
        window.history.pushState({}, '', url);
    }, [selectedTopics]);

    if (!topicsByCategoryViewModel) {
        return <DefaultLoading />;
    }

    if (topicsByCategoryViewModel.mode !== 'default') {
        return (
            <DefaultError
                errorMessage={topicsByCategoryViewModel.data.message}
            />
        );
    }

    const filterSwitchTitle = 'Filter by Topic';
    const contentClassName = 'mt-8';

    return (
        <Tabs.Root
            defaultTab="all"
            onValueChange={() => {
                // Reset selected topics when switching tabs
                setSelectedTopics([]);
            }}
        >
            <Tabs.List>
                <Tabs.Trigger value="all">All</Tabs.Trigger>
                {categories.map((category) => {
                    return (
                        <Tabs.Trigger value={category} key={category}>
                            {category}
                        </Tabs.Trigger>
                    );
                })}
            </Tabs.List>
            <Tabs.Content value="all" className={contentClassName}>
                <FilterSwitch
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    title={filterSwitchTitle}
                    list={allTopics}
                />
            </Tabs.Content>
            {categories.map((category) => {
                const topics =
                    topicsByCategoryViewModel.data.topicsByCategory[category];
                return (
                    <Tabs.Content
                        value={category}
                        key={category}
                        className={contentClassName}
                    >
                        <FilterSwitch
                            selectedTopics={selectedTopics}
                            setSelectedTopics={setSelectedTopics}
                            title={filterSwitchTitle}
                            list={topics}
                        />
                    </Tabs.Content>
                );
            })}
        </Tabs.Root>
    );
}

interface OffersProps {
    initialSelectedTopics?: string[];
}

export default function Offers(props: OffersProps) {
    const [outlineResponse] = trpc.getOffersPageOutline.useSuspenseQuery({});
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TOffersPageOutlineViewModel | undefined
    >(undefined);
    const { presenter } = useGetOffersPageOutlinePresenter(setOutlineViewModel);
    presenter.present(outlineResponse, outlineViewModel);

    if (!outlineViewModel) {
        return <DefaultLoading />;
    }

    if (outlineViewModel.mode === 'kaboom') {
        return <DefaultError errorMessage={outlineViewModel.data.message} />;
    }

    const outline = outlineViewModel.data;

    return (
        <div className="flex flex-col space-y-5">
            <Outline title={outline.title} description={outline.description} />
            <SectionHeading text="What's your goal?" />
            <OffersFilters
                initialSelectedTopics={props.initialSelectedTopics}
            />
        </div>
    );
}
