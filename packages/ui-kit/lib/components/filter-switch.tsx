'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    getDictionary,
    isLocalAware,
} from '@maany_shr/e-class-translations';
import { Button } from './button';
import { IconChevronLeft } from './icons/icon-chevron-left';
import { IconChevronRight } from './icons/icon-chevron-right';

interface TopicListProps extends isLocalAware {
    list: {
        name: string;
        slug: string;
    }[];
    title: string;
    selectedTopics: string[];
    // eslint-disable-next-line no-unused-vars
    setSelectedTopics: (_selectedTopics: string[]) => void;
    // eslint-disable-next-line no-unused-vars
    onFilterChange?: (_selectedTopicNames: string[]) => void;
}

const MAX_VISIBLE_ROWS = 3;

function getVisibleRowCount(elements: HTMLElement[]) {
    const rowTops = new Set(
        elements
            .filter((element) => element.style.display !== 'none')
            .map((element) => Math.round(element.getBoundingClientRect().top)),
    );

    return rowTops.size;
}

/**
 * A reusable FilterSwitch component that displays a list of topics as filter buttons.
 * Supports selecting multiple filters at once.
 *
 * @param title The title displayed above the topic list.
 * @param list An array of topics, each containing a `name`.
 * @param selectedTopics An array of currently selected topic names.
 * @param setSelectedTopics A function to update the selected topics state.
 * @param onFilterChange Optional callback function that receives an array of selected topic names.
 *
 * @example
 * const topics = [
 *   { name: 'React' },
 *   { name: 'Next.js' },
 * ];
 *
 * const handleFilterChange = (topicNames) => {
 *   console.log('Selected topics:', topicNames);
 * };
 *
 * <FilterSwitch title="Filter By Topic" list={topics} onFilterChange={handleFilterChange} />
 */
const FilterSwitch: React.FC<TopicListProps> = ({
    title,
    list,
    locale,
    onFilterChange,
    selectedTopics,
    setSelectedTopics,
}) => {
    const measurementContainerRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [visibleTopicCount, setVisibleTopicCount] = useState(list.length);
    const [hasOverflow, setHasOverflow] = useState(false);
    const dictionary = getDictionary(locale);
    const viewAllText = dictionary.components.paginationButton.viewAll;
    const showLessText = dictionary.components.paginationButton.showLess;

    const handleTopicClick = (topicSlug: string) => {
        let newSelectedTopics: string[];

        if (selectedTopics.includes(topicSlug)) {
            newSelectedTopics = selectedTopics.filter(
                (name) => name !== topicSlug,
            );
        } else {
            newSelectedTopics = [...selectedTopics, topicSlug];
        }

        setSelectedTopics(newSelectedTopics);

        if (onFilterChange) {
            onFilterChange(newSelectedTopics);
        }
    };

    const updateVisibleTopicCount = useCallback(() => {
        const container = measurementContainerRef.current;

        if (!container) {
            return;
        }

        const topicNodes = Array.from(
            container.querySelectorAll<HTMLElement>('[data-measure-topic]'),
        );
        const viewAllNode =
            container.querySelector<HTMLElement>('[data-measure-view-all]');

        if (!viewAllNode || topicNodes.length === 0) {
            setVisibleTopicCount(list.length);
            setHasOverflow(false);
            return;
        }

        topicNodes.forEach((node) => {
            node.style.display = '';
        });
        viewAllNode.style.display = 'none';

        if (getVisibleRowCount(topicNodes) <= MAX_VISIBLE_ROWS) {
            setVisibleTopicCount(list.length);
            setHasOverflow(false);
            return;
        }

        setHasOverflow(true);

        for (let count = topicNodes.length - 1; count >= 0; count -= 1) {
            topicNodes.forEach((node, index) => {
                node.style.display = index < count ? '' : 'none';
            });
            viewAllNode.style.display = '';

            if (
                getVisibleRowCount([...topicNodes, viewAllNode]) <=
                MAX_VISIBLE_ROWS
            ) {
                setVisibleTopicCount(count);
                return;
            }
        }

        setVisibleTopicCount(0);
    }, [list.length]);

    useEffect(() => {
        updateVisibleTopicCount();

        const resizeObserver =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => updateVisibleTopicCount())
                : null;

        if (measurementContainerRef.current) {
            resizeObserver?.observe(measurementContainerRef.current);
        }

        window.addEventListener('resize', updateVisibleTopicCount);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateVisibleTopicCount);
        };
    }, [updateVisibleTopicCount]);

    const visibleTopics =
        !hasOverflow || isExpanded ? list : list.slice(0, visibleTopicCount);

    return (
        <div className="w-full flex flex-col gap-4">
            <h5 className="text-text-primary md:text-lg lg:text-2xl">
                {title}
            </h5>

            <div className="relative w-full">
                <div className="flex flex-wrap items-start gap-2">
                    {visibleTopics.map((topic) => (
                        <Button
                            key={topic.slug}
                            size="medium"
                            className="border-1 border-button-secondary-stroke"
                            variant={
                                selectedTopics.includes(topic.slug)
                                    ? 'primary'
                                    : 'secondary'
                            }
                            text={topic.name}
                            onClick={() => handleTopicClick(topic.slug)}
                        />
                    ))}
                    {hasOverflow && !isExpanded && (
                        <Button
                            size="medium"
                            variant="text"
                            text={viewAllText}
                            hasIconRight
                            iconRight={<IconChevronRight />}
                            onClick={() => setIsExpanded(true)}
                        />
                    )}
                    {hasOverflow && isExpanded && (
                        <Button
                            size="medium"
                            variant="text"
                            text={showLessText}
                            hasIconLeft
                            iconLeft={<IconChevronLeft />}
                            onClick={() => setIsExpanded(false)}
                        />
                    )}
                </div>

                {/* Hidden measurement copy used to determine how many chips fit within 3 rows at the current viewport width. */}
                <div
                    ref={measurementContainerRef}
                    aria-hidden="true"
                    className="pointer-events-none invisible absolute inset-0 -z-10 flex flex-wrap items-start gap-2"
                >
                    {list.map((topic) => (
                        <div key={`measure-${topic.slug}`} data-measure-topic>
                            <Button
                                size="medium"
                                className="border-1 border-button-secondary-stroke"
                                variant={
                                    selectedTopics.includes(topic.slug)
                                        ? 'primary'
                                        : 'secondary'
                                }
                                text={topic.name}
                            />
                        </div>
                    ))}
                    <div data-measure-view-all>
                        <Button
                            size="medium"
                            variant="text"
                            text={viewAllText}
                            hasIconRight
                            iconRight={<IconChevronRight />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSwitch;
