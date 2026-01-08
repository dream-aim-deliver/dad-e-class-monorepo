'use client';

import React, {
    useRef,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import { IconChevronLeft } from '../icons/icon-chevron-left';
import { IconChevronRight } from '../icons/icon-chevron-right';
import { isLocalAware } from '@maany_shr/e-class-translations';

interface CarouselProps extends isLocalAware {
    children: React.ReactNode;
    className?: string;
}

// Content renderer that won't re-render on state changes
export const CarouselContent: React.FC<{
    items: React.ReactNode[];
    itemsPerView: number;
}> = React.memo(({ items, itemsPerView }) => {
    return (
        <div className="flex w-full justify-center flex-shrink-0 transition-opacity duration-300 opacity-100">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`flex-shrink-0 justify-items-center px-2 transition-all duration-300 ${
                        itemsPerView === 1 || items.length === 1
                            ? 'w-full max-w-[90%] mx-auto'
                            : itemsPerView === 2
                              ? 'w-1/2 max-w-[45%]'
                              : 'w-1/3 max-w-[30%]'
                    }`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
});

/**
 * `Carousel` is a responsive, touch-friendly slider component for displaying
 * multiple items (cards, images, etc.) with navigation controls, pagination,
 * and automatic layout adjustments based on screen size.
 *
 * ## Features
 * - **Responsive layout**: Automatically adjusts items per view:
 *   - `<640px`: 1 item
 *   - `<1024px`: 2 items
 *   - `≥1024px`: 3 items
 * - **Keyboard & touch support**: Swipe on touch devices, click buttons, or tap pagination dots.
 * - **Accessibility**: Uses `aria-label`, `role="region"`, `role="list"`, and `role="listitem"`.
 * - **Optimized rendering**: The `CarouselContent` subcomponent is memoized to avoid unnecessary re-renders.
 * - **Customizable styling**: Accepts a `className` prop for container styling.
 * - **Localization-ready**: Accepts a `locale` prop via `isLocalAware` interface for translated content.
 *
 * ## Props
 * @prop {React.ReactNode} children - The items to display in the carousel.
 * @prop {string} className - Additional classes for outer container styling.
 * @prop {string} [locale] - Optional locale for localization support.
 *
 * ## Usage
 * ```tsx
 * import { Carousel } from './Carousel';
 * import { ProductCard } from './ProductCard';
 *
 * export default function Example() {
 *   return (
 *     <Carousel className="my-8" locale="en">
 *       <ProductCard title="Product A" price="$19" />
 *       <ProductCard title="Product B" price="$29" />
 *       <ProductCard title="Product C" price="$39" />
 *       <ProductCard title="Product D" price="$49" />
 *     </Carousel>
 *   );
 * }
 * ```
 *
 * ## Notes
 * - Pagination dots and navigation arrows appear only if there’s more than one page.
 * - Touch swipe gestures trigger navigation after a horizontal movement > 50px.
 * - Each child should ideally have a unique `key` for React reconciliation.
 */

export const CarouselController: React.FC<CarouselProps> = React.memo(
    ({ children, className = '', locale }) => {
        const carouselRef = useRef<HTMLDivElement>(null);
        const [currentPage, setCurrentPage] = useState(0);
        const [itemsPerView, setItemsPerView] = useState(() => {
            // Initialize with the correct value based on window width
            if (typeof window !== 'undefined') {
                const width = window.innerWidth;
                if (width < 640) return 1;
                if (width < 1024) return 2;
                return 3;
            }
            return 3; // Default for SSR
        });

        const [touchStart, setTouchStart] = useState(0);
        const childrenArray = React.Children.toArray(children);

        // Group children into pages
        const itemGroups = useMemo(() => {
            const groups: React.ReactNode[][] = [];
            for (let i = 0; i < childrenArray.length; i += itemsPerView) {
                groups.push(childrenArray.slice(i, i + itemsPerView));
            }
            return groups;
        }, [childrenArray, itemsPerView]);

        // Responsive items per view
        useEffect(() => {
            const updateItemsPerView = () => {
                const width = window.innerWidth;
                if (width < 640) {
                    setItemsPerView(1);
                } else if (width < 1024) {
                    setItemsPerView(2);
                } else {
                    setItemsPerView(3);
                }
            };

            updateItemsPerView();
            const handleResize = () => {
                updateItemsPerView();
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        // Keep currentPage valid
        useEffect(() => {
            if (currentPage >= itemGroups.length) {
                setCurrentPage(Math.max(0, itemGroups.length - 1));
            }
        }, [itemGroups, currentPage]);

        // Navigation handlers
        const goToPage = useCallback(
            (pageIndex: number) => {
                if (pageIndex >= 0 && pageIndex < itemGroups.length) {
                    setCurrentPage(pageIndex);
                }
            },
            [itemGroups.length],
        );

        const goNext = useCallback(() => {
            if (currentPage < itemGroups.length - 1) goToPage(currentPage + 1);
        }, [currentPage, itemGroups.length, goToPage]);

        const goPrev = useCallback(() => {
            if (currentPage > 0) goToPage(currentPage - 1);
        }, [currentPage, goToPage]);

        // Touch handlers
        const handleTouchStart = useCallback((e: React.TouchEvent) => {
            setTouchStart(e.touches[0].clientX);
        }, []);

        const handleTouchMove = useCallback(
            (e: React.TouchEvent) => {
                const touchEnd = e.touches[0]?.clientX ?? 0;
                const swipeDistance = touchStart - touchEnd;
                if (swipeDistance > 50 && currentPage < itemGroups.length - 1) {
                    goNext();
                } else if (swipeDistance < -50 && currentPage > 0) {
                    goPrev();
                }
            },
            [touchStart, currentPage, itemGroups.length, goNext, goPrev],
        );

        if (childrenArray.length === 0) return null;

        return (
            <div className={`px-4 md:px-6 lg:px-8 ${className}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="relative">
                        {/* Previous Button */}
                        {itemGroups.length > 1 && (
                            <button
                                onClick={goPrev}
                                disabled={currentPage === 0}
                                className={`absolute left-[-10px] sm:left-[-20px] md:-left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-colors ${
                                    currentPage === 0
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                }`}
                                aria-label="Previous slide"
                            >
                                <IconChevronLeft classNames="text-button-primary-fill w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        )}

                        {/* Carousel Content Wrapper */}
                        <div
                            ref={carouselRef}
                            className="overflow-hidden transition-all duration-500"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            role="region"
                            aria-label="Carousel"
                        >
                            <div className="relative flex ease-in-out w-full justify-center">
                                {itemGroups[currentPage] && (
                                    <CarouselContent
                                        items={itemGroups[currentPage]}
                                        itemsPerView={itemsPerView}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Next Button */}
                        {itemGroups.length > 1 && (
                            <button
                                onClick={goNext}
                                disabled={currentPage === itemGroups.length - 1}
                                className={`absolute right-[-10px] sm:right-[-20px] md:-right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-colors ${
                                    currentPage === itemGroups.length - 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                }`}
                                aria-label="Next slide"
                            >
                                <IconChevronRight classNames="text-button-primary-fill w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        )}
                    </div>

                    {/* Pagination */}
                    {itemGroups.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-6">
                            {itemGroups.map((_, index) => (
                                <button
                                    key={`page-${index}`}
                                    onClick={() => goToPage(index)}
                                    className={`w-3 h-3 rounded-full transition-colors duration-200 cursor-pointer ${
                                        index === currentPage
                                            ? 'bg-button-primary-fill'
                                            : 'border border-button-primary-fill hover:bg-text-primary/20'
                                    }`}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

export const Carousel = CarouselController;
