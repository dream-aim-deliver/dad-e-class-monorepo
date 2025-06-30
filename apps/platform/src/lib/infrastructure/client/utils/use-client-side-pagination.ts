import { useMemo, useState } from 'react';

interface UseClientSidePaginationProps<T = any> {
    items: T[];
    itemsPerPage?: number;
}

export default function useClientSidePagination<T = any>({
    items,
    itemsPerPage = 6,
}: UseClientSidePaginationProps<T>) {
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
