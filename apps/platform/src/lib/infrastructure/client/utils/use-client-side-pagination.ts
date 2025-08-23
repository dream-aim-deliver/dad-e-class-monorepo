import { useMemo, useState, useEffect } from 'react';

interface UseClientSidePaginationProps<T = any> {
    items: T[];
    itemsPerPage?: number;
    itemsPerPage2xl?: number;
}

export default function useClientSidePagination<T = any>({
    items,
    itemsPerPage = 6,
    itemsPerPage2xl = 8,
}: UseClientSidePaginationProps<T>) {
    const [is2xl, setIs2xl] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const checkScreenSize = () => {
            setIs2xl(window.innerWidth >= 1536);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const effectiveItemsPerPage = !isClient 
        ? itemsPerPage2xl
        : is2xl ? itemsPerPage2xl : itemsPerPage;
    
    const [displayedCount, setDisplayedCount] = useState(effectiveItemsPerPage);

    useEffect(() => {
        if (isClient) {
            setDisplayedCount(effectiveItemsPerPage);
        }
    }, [effectiveItemsPerPage, isClient]);

    const displayedItems = useMemo(() => {
        return items.slice(0, displayedCount);
    }, [items, displayedCount]);

    const hasMoreItems = displayedCount < items.length;

    const handleLoadMore = () => {
        setDisplayedCount((prev) =>
            Math.min(prev + effectiveItemsPerPage, items.length),
        );
    };

    return {
        displayedItems,
        hasMoreItems,
        handleLoadMore,
    };
}
