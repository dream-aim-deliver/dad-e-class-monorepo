'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Fuse, { FuseOptionKey } from 'fuse.js';
import { InputField } from './input-field';
import { IconSearch } from './icons/icon-search';

export interface SearchInputProps<T> {
    items: T[];
    keys: FuseOptionKey<T>[];
    onResults: (results: T[]) => void;
    onLoading?: (loading: boolean) => void;
    onQueryChange?: (query: string) => void;
    placeholder?: string;
    debounceDelay?: number;
    threshold?: number;
    className?: string;
}

/**
 * A reusable SearchInput component with fuzzy search and debouncing.
 *
 * @param items Array of items to search through.
 * @param keys Keys in the items to search on.
 * @param onResults Callback function called with the filtered results.
 * @param placeholder Placeholder text for the input.
 * @param debounceDelay Delay in ms for debouncing (default 300).
 * @param threshold Fuse.js threshold for fuzzy matching (default 0.4).
 * @param className Optional CSS class for the container.
 */
export function SearchInput<T>({
    items,
    keys,
    onResults,
    onLoading,
    onQueryChange,
    placeholder = 'Search...',
    debounceDelay = 300,
    threshold = 0.4,
    className,
}: SearchInputProps<T>) {
    const [query, setQuery] = useState('');

    // Notify parent of query changes
    useEffect(() => {
        onQueryChange?.(query);
    }, [query, onQueryChange]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const itemsRef = useRef<T[]>(items);

    // Update items ref when items change
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const fuse = useMemo(
        () => new Fuse(items, { keys, threshold }),
        [items, keys, threshold]
    );

    const performSearch = useCallback(
        (q: string) => {
            const currentItems = itemsRef.current;
            if (q.trim() === '') {
                onResults(currentItems);
            } else {
                const results = fuse.search(q).map((result) => result.item);
                onResults(results);
            }
        },
        [fuse, onResults]
    );

    // Handle search with debouncing
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Call immediately for empty query (initial state)
        if (query.trim() === '') {
            onLoading?.(false);
            performSearch(query);
        } else {
            onLoading?.(true);
            debounceRef.current = setTimeout(() => {
                performSearch(query);
                onLoading?.(false);
            }, debounceDelay);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, debounceDelay]);

    // Update results when items change (without debounce)
    useEffect(() => {
        performSearch(query);
    }, [items]);

    return (
        <div className={className}>
            <InputField
                hasLeftContent={true}
                leftContent={<IconSearch />}
                inputText={placeholder}
                value={query}
                setValue={setQuery}
                state={query ? 'filling' : 'placeholder'}
            />
        </div>
    );
}