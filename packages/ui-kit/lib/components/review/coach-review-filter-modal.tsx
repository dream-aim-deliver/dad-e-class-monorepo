'use client';

import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { TextInput } from '../text-input';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

// Coach review filter model
export interface CoachReviewFilterModel {
    minRating?: number;
    maxRating?: number;
    dateAfter?: string;
    dateBefore?: string;
}

interface CoachReviewFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: CoachReviewFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<CoachReviewFilterModel>;
}

export const CoachReviewFilterModal: React.FC<CoachReviewFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    locale,
}) => {
    const dictionary = getDictionary(locale).components.coachReviewFilterModal;
    const [filters, setFilters] = useState<Partial<CoachReviewFilterModel>>({
        minRating: initialFilters.minRating || 1,
        maxRating: initialFilters.maxRating || 5,
        dateAfter: initialFilters.dateAfter,
        dateBefore: initialFilters.dateBefore,
    });
    const [resetKey, setResetKey] = useState(0);

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleRatingChange = (field: 'minRating' | 'maxRating', value: string) => {
        const numValue = parseInt(value) || (field === 'minRating' ? 1 : 5);
        const clampedValue = Math.max(1, Math.min(5, numValue));
        setFilters((prev) => ({ ...prev, [field]: clampedValue }));
    };

    const handleReset = () => {
        setFilters({
            minRating: 1,
            maxRating: 5,
            dateAfter: undefined,
            dateBefore: undefined,
        });
        setResetKey((prev) => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as CoachReviewFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 mt-12" onClick={onClose}>
            <div className="relative flex flex-col gap-4 p-6 bg-card-fill border border-card-stroke text-text-primary w-full max-w-[430px] max-h-[85vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{dictionary.filterReviews}</h2>
                    <div className="flex top-0 right-0 p-0">
                        <Button variant="text" size="small" onClick={onClose} text="✕" />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Rating Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.ratingFilter}</h3>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <TextInput
                                key={`minRating-${resetKey}`}
                                inputField={{
                                    id: 'minRating',
                                    className: 'w-full text-white border-input-stroke',
                                    defaultValue: filters.minRating?.toString() || '1',
                                    setValue: (value: string) => handleRatingChange('minRating', value),
                                    inputText: dictionary.minRating,
                                    type: 'number',
                                    min: 1,
                                    max: 5,
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <TextInput
                                key={`maxRating-${resetKey}`}
                                inputField={{
                                    id: 'maxRating',
                                    className: 'w-full text-white border-input-stroke',
                                    defaultValue: filters.maxRating?.toString() || '5',
                                    setValue: (value: string) => handleRatingChange('maxRating', value),
                                    inputText: dictionary.maxRating,
                                    type: 'number',
                                    min: 1,
                                    max: 5,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Date Range Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.dateFilter}</h3>
                    <DateInput
                        label={dictionary.afterDate}
                        value={filters.dateAfter || ''}
                        onChange={(value: string) => handleChange('dateAfter', value)}
                        locale={locale}
                    />
                    <DateInput
                        label={dictionary.beforeDate}
                        value={filters.dateBefore || ''}
                        onChange={(value: string) => handleChange('dateBefore', value)}
                        locale={locale}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="medium"
                        onClick={handleReset}
                        className="flex-1"
                        text={dictionary.resetFilters}
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleApply}
                        className="flex-1"
                        text={dictionary.applyFilters}
                    />
                </div>
            </div>
        </div>
    );
};