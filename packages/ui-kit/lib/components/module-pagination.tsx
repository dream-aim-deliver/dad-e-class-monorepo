import React from 'react';
import { Button } from './button';
import { IconChevronRight } from './icons/icon-chevron-right';
import { IconChevronLeft } from './icons/icon-chevron-left';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { cn } from '../utils/style-utils';

interface ModulePaginationProps extends isLocalAware {
    currentIndex: number;
    totalLessons: number;
    onPrevious: () => void;
    onNext: () => void;
    className?: string;
};

/**
 * A reusable pagination component for navigating lessons within a module.
 * Supports localization, disables navigation buttons at bounds, and provides contextual lesson count display.
 *
 * @param currentIndex The zero-based index of the currently viewed lesson.
 * @param totalLessons Total number of lessons in the module.
 * @param onPrevious Callback triggered when the user clicks the "Previous" button.
 * @param onNext Callback triggered when the user clicks the "Next" button.
 * @param className Optional additional CSS classes for custom styling.
 * @param locale The current locale string used to fetch localized dictionary content (from isLocalAware).
 *
 * @example
 * <ModulePagination
 *   currentIndex={1}
 *   totalLessons={5}
 *   onPrevious={() => handlePrev()}
 *   onNext={() => handleNext()}
 *   className="custom-class"
 *   locale="en"
 * />
 */
export const ModulePagination: React.FC<ModulePaginationProps> = ({ currentIndex, totalLessons, onPrevious, onNext, className, locale }) => {
    const dictionary = getDictionary(locale);

    return (
        <div className={cn("flex items-center gap-3.5 px-4 py-2", className)}>
            <Button
                variant='text'
                onClick={onPrevious}
                disabled={currentIndex === 0}
                text={dictionary?.components?.modulePagination?.previous}
                hasIconLeft
                iconLeft={<IconChevronLeft />}
                className='p-0'
            />
            <span className="text-text-primary">{dictionary?.components?.modulePagination?.lesson} {currentIndex + 1} / {totalLessons}</span>

            <Button
                variant='text'
                onClick={onNext}
                disabled={currentIndex === totalLessons - 1}
                text={dictionary?.components?.modulePagination?.next}
                hasIconRight
                iconRight={<IconChevronRight />}
                className='p-0'
            />
        </div>
    );
};