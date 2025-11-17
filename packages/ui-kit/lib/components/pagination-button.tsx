'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/style-utils';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

export interface PaginationButtonProps {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
    locale: TLocale;
    className?: string;
}

export const PaginationButton = ({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
    locale,
    className,
}: PaginationButtonProps) => {
    const dictionary = getDictionary(locale);
    const paginationDict = dictionary.components.paginationButton;

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const buttonClasses = cn(
        'px-3 py-2 rounded-md',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:bg-neutral-800 disabled:hover:bg-transparent'
    );

    return (
        <div
            className={cn(
                'flex items-center gap-4',
                'text-text-primary text-sm',
                className
            )}
        >
            <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={buttonClasses}
                aria-label={paginationDict.previous}
            >
                <div className="flex items-center gap-2">
                    <ChevronLeft className="h-5 w-5" />
                    <span>{paginationDict.previous}</span>
                </div>
            </button>

            <span className="text-text-secondary">
                {paginationDict.page} {currentPage} {paginationDict.of} {totalPages}
            </span>

            <button
                onClick={onNext}
                disabled={!hasNext}
                className={buttonClasses}
                aria-label={paginationDict.next}
            >
                <div className="flex items-center gap-2">
                    <span>{paginationDict.next}</span>
                    <ChevronRight className="h-5 w-5" />
                </div>
            </button>
        </div>
    );
};
