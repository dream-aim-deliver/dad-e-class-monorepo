import { useMemo, useState } from 'react';

interface UseClientSidePaginationProps {
    items: any[];
    itemsPerPage?: number;
}

export default function useClientSidePagination({
    items,
    itemsPerPage = 6,
}: UseClientSidePaginationProps) {
    const [displayedCount, setDisplayedCount] = useState(itemsPerPage);

    const displayedItems = useMemo(() => {
        return items.slice(0, displayedCount);
    }, [items, displayedCount]);

    const hasMoreItems = displayedCount < items.length;

    const handleLoadMore = () => {
        setDisplayedCount((prev) =>
            Math.min(prev + itemsPerPage, items.length),
        );
    };

    return {
        displayedItems,
        hasMoreItems,
        handleLoadMore,
    };
}
