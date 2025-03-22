import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "../button";
import GeneralCard from "./generalcard";
import { IconChevronLeft } from "../icons/icon-chevron-left";
import { IconChevronRight } from "../icons/icon-chevron-right";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { homePage } from "@maany_shr/e-class-models";

interface GeneralCardCarouselProps extends isLocalAware {
  cards: homePage.TGeneralCard[];
  onClick?: () => void;
}

export const GeneralCardCarousel: React.FC<GeneralCardCarouselProps> = React.memo(
  ({ cards, locale, onClick }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);
    const [touchStart, setTouchStart] = useState(0);
    const dictionary = useMemo(() => getDictionary(locale), [locale]);

    const cardGroups = useMemo(() => {
      const groups: homePage.TGeneralCard[][] = [];
      for (let i = 0; i < cards.length; i += cardsPerView) {
        groups.push(cards.slice(i, i + cardsPerView));
      }
      return groups;
    }, [cards, cardsPerView]);

    useEffect(() => {
      const updateCardsPerView = () => {
        if (window.innerWidth < 640) setCardsPerView(1);
        else if (window.innerWidth < 1024) setCardsPerView(2);
        else setCardsPerView(3);
      };

      updateCardsPerView();

      let resizeTimer: ReturnType<typeof setTimeout>;
      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCardsPerView, 100);
      };

      window.addEventListener("resize", debouncedResize);
      return () => {
        window.removeEventListener("resize", debouncedResize);
        clearTimeout(resizeTimer);
      };
    }, []);

    useEffect(() => {
      if (currentPage >= cardGroups.length) {
        setCurrentPage(Math.max(0, cardGroups.length - 1));
      }
    }, [cardGroups, currentPage]);

    const goToPage = useCallback(
      (pageIndex: number) => {
        if (pageIndex >= 0 && pageIndex < cardGroups.length) {
          setCurrentPage(pageIndex);
        }
      },
      [cardGroups.length]
    );

    const goNext = useCallback(() => {
      if (currentPage < cardGroups.length - 1) {
        goToPage(currentPage + 1);
      }
    }, [currentPage, cardGroups.length, goToPage]);

    const goPrev = useCallback(() => {
      if (currentPage > 0) {
        goToPage(currentPage - 1);
      }
    }, [currentPage, goToPage]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
    }, []);

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        const touchEnd = e.touches[0]?.clientX ?? 0;
        if (touchStart - touchEnd > 50 && currentPage < cardGroups.length - 1) {
          goToPage(currentPage + 1);
        } else if (touchStart - touchEnd < -50 && currentPage > 0) {
          goToPage(currentPage - 1);
        }
      },
      [touchStart, currentPage, cardGroups.length, goToPage]
    );

    if (cards.length === 0) {
      return null;
    }

    return (
      <div className="px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {cardGroups.length > 1 && (
              <button
                onClick={goPrev}
                className={`absolute left-[-10px] sm:left-[-20px] md:-left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-colors ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={currentPage === 0}
                aria-label="Previous slide"
              >
                <IconChevronLeft classNames="text-button-primary-fill w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            <div
              ref={carouselRef}
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div className="relative flex transition-transform duration-300 ease-in-out w-full">
                {cardGroups[currentPage] && (
                  <div
                    key={`group-${currentPage}`}
                    className="flex w-full flex-shrink-0 transition-opacity duration-300 opacity-100 z-10"
                    style={{ transform: 'translateX(0)' }}
                  >
                    {cardGroups[currentPage].map((card) => (
                      <div
                        key={card.title}
                        className={`flex-shrink-0 px-2 ${
                          cardsPerView === 1
                            ? "w-full max-w-[90%] mx-auto"
                            : cardsPerView === 2
                            ? "w-1/2"
                            : "w-1/3"
                        }`}
                      >
                        <GeneralCard
                          imageUrl={card.imageUrl}
                          title={card.title}
                          description={card.description}
                          badge={card.badge}
                          buttonText={card.buttonText}
                          buttonUrl={card.buttonUrl}
                          locale={locale}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {cardGroups.length > 1 && (
              <button
                onClick={goNext}
                className={`absolute right-[-10px] sm:right-[-20px] md:-right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-colors ${
                  currentPage === cardGroups.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={currentPage === cardGroups.length - 1}
                aria-label="Next slide"
              >
                <IconChevronRight classNames="text-button-primary-fill w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {cardGroups.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {cardGroups.map((_, index) => (
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
              key="default-cta-button"
              variant="primary"
              size="big"
              text={dictionary.components.generalCard.buttonText}
              onClick={onClick || (() => alert('CTA Button Clicked'))}
            />
          </div>
        </div>
      </div>
    );
  }
);