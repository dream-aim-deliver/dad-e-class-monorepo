'use client';

import { topic } from '@maany_shr/e-class-models';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconChevronLeft } from './icons/icon-chevron-left';
import { IconChevronRight } from './icons/icon-chevron-right';

interface TopicListProps extends isLocalAware {
    list: topic.TTopic[];
    title: string;
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
 * A reusable TopicList component that displays a list of topic buttons.
 * When the list exceeds 3 rows, the last visible item becomes a `View all`
 * action that expands the full list in place.
 */
const TopicList: React.FC<TopicListProps> = ({ title, list, locale }) => {
    const measurementContainerRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [visibleTopicCount, setVisibleTopicCount] = useState(list.length);
    const [hasOverflow, setHasOverflow] = useState(false);
    const dictionary = getDictionary(locale);
    const viewAllText = dictionary.components.paginationButton.viewAll;
    const showLessText = dictionary.components.paginationButton.showLess;

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
        <div className="w-full flex flex-col items-center justify-center gap-6 py-2">
            <h3 className="text-text-primary lg:text-mega text-2xl">{title}</h3>

            <div className="relative w-full">
                <div className="flex gap-2 flex-wrap items-center justify-center">
                    {visibleTopics.map((topicItem) => (
                        <a href={topicItem.url} key={topicItem.slug}>
                            <Button
                                size="medium"
                                variant="secondary"
                                text={topicItem.name}
                            />
                        </a>
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
                    className="pointer-events-none invisible absolute inset-0 -z-10 flex flex-wrap items-center justify-center gap-2"
                >
                    {list.map((topicItem) => (
                        <a
                            href={topicItem.url}
                            key={`measure-${topicItem.slug}`}
                            data-measure-topic
                        >
                            <Button
                                size="medium"
                                variant="secondary"
                                text={topicItem.name}
                            />
                        </a>
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

export default TopicList;
