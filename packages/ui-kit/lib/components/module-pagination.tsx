import React from 'react';
import { Button } from './button';
import { IconChevronRight } from './icons/icon-chevron-right';
import { IconChevronLeft } from './icons/icon-chevron-left';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface ModulePaginationProps extends isLocalAware {
    currentIndex: number;
    totalLessons: number;
    onPrevious: () => void;
    onNext: () => void;
};

export const ModulePagination: React.FC<ModulePaginationProps> = ({ currentIndex, totalLessons, onPrevious, onNext, locale }) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex items-center gap-3.5 px-4 py-2">
            <Button
                variant='text'
                onClick={onPrevious}
                disabled={currentIndex === 0}
                text={dictionary.components.modulePagination.previous}
                hasIconLeft
                iconLeft={<IconChevronLeft />}
            />
            <span className="text-text-primary">{dictionary.components.modulePagination.lesson} {currentIndex + 1} / {totalLessons}</span>

            <Button
                variant='text'
                onClick={onNext}
                disabled={currentIndex === totalLessons - 1}
                text={dictionary.components.modulePagination.next}
                hasIconRight
                iconRight={<IconChevronRight />}
            />
        </div>
    );
};