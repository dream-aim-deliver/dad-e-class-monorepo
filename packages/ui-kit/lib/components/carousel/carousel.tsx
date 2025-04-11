import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { IconChevronLeft } from "../icons/icon-chevron-left";
import { IconChevronRight } from "../icons/icon-chevron-right";
import { Button } from "../button";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

interface CarouselProps extends isLocalAware {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Content renderer that won't re-render on state changes
export const CarouselContent: React.FC<{
  items: React.ReactNode[];
  itemsPerView: number;
}> = React.memo(({ items, itemsPerView }) => {
  return (
    <div className="flex w-full justify-center flex-shrink-0 transition-opacity duration-300 opacity-100 z-10">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex-shrink-0 px-2 ${
            itemsPerView === 1
              ? "w-full max-w-[90%] mx-auto"
              : itemsPerView === 2
              ? "w-1/2 max-w-[45%]"
              : "w-1/3 max-w-[30%]"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
});

/**
 * A responsive carousel component that displays its children in a sliding layout.
 * Includes navigation buttons, touch gesture support, pagination, and a CTA button.
 *
 * @param children The content to display inside the carousel (e.g., cards or custom elements).
 * @param className Optional CSS class for additional styling of the carousel container.
 * @param locale The locale for translation and localization purposes (e.g., "en" for English, "de" for German).
 * @param onClick Optional callback function triggered when the CTA button is clicked.
 *
 * @example
 * <Carousel
 *   className="custom-carousel"
 *   locale="en"
 *   onClick={() => console.log("CTA clicked!")}
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 *   <div>Item 4</div>
 * </Carousel>
 */
export const CarouselController: React.FC<CarouselProps> = React.memo(
  ({ children, className = "", locale, onClick }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3); // Default to 3, will be adjusted by screen size
    const [touchStart, setTouchStart] = useState(0);
    const dictionary = getDictionary(locale);
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
        if (window.innerWidth < 640) setItemsPerView(1);
        else if (window.innerWidth < 1024) setItemsPerView(2);
        else setItemsPerView(3);
      };

      updateItemsPerView();
      let resizeTimer: ReturnType<typeof setTimeout>;
      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateItemsPerView, 100);
      };

      window.addEventListener("resize", debouncedResize);
      return () => {
        window.removeEventListener("resize", debouncedResize);
        clearTimeout(resizeTimer);
      };
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
      [itemGroups.length]
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
      [touchStart, currentPage, itemGroups.length, goNext, goPrev]
    );

    if (childrenArray.length === 0) return null;

    return (
      <div className={`px-4 md:px-6 lg:px-8 py-8 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Previous Button */}
            {itemGroups.length > 1 && (
              <button
                onClick={goPrev}
                disabled={currentPage === 0}
                className={`absolute left-[-10px] sm:left-[-20px] md:-left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-colors ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                aria-label="Previous slide"
              >
                <IconChevronLeft classNames="text-button-primary-fill w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Carousel Content Wrapper */}
            <div
              ref={carouselRef}
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              role="region"
              aria-label="Carousel"
            >
              <div className="relative flex transition-transform duration-300 ease-in-out w-full justify-center">
                {itemGroups[currentPage] && (
                  <CarouselContent items={itemGroups[currentPage]} itemsPerView={itemsPerView} />
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
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
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
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentPage
                      ? "bg-button-primary-fill"
                      : "border border-button-primary-fill hover:bg-text-primary/20"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8 px-4">
            <Button
              variant="primary"
              size="big"
              text={dictionary.components.generalCard.buttonText}
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    );
  }
);

export const Carousel = CarouselController;