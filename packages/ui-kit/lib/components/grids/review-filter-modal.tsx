'use client';

import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { TextInput } from '../text-input';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import StarRatingInput from '../star-rating-input';

export interface ReviewFilterModel {
    minRating?: number;
    maxRating?: number;
    studentName?: string;
    courseName?: string;
    dateAfter?: string;
    dateBefore?: string;
}

interface ReviewFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: ReviewFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<ReviewFilterModel>;
}

/**
 * ReviewFilterModal is a reusable modal component for filtering user reviews in a grid or list.
 *
 * @param onApplyFilters Callback function triggered when the user applies filters. Receives the current `ReviewFilterModel` object.
 * @param onClose Callback function triggered when the modal is closed (background or close button).
 * @param onReset Optional callback function triggered when the reset button is clicked.
 * @param onApply Optional callback function triggered when the apply button is clicked (in addition to onApplyFilters).
 * @param initialFilters Optional initial filter values to pre-populate the modal fields.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * ```tsx
 * <ReviewFilterModal
 *   onApplyFilters={(filters) => console.log('Filters applied:', filters)}
 *   onClose={() => console.log('Modal closed')}
 *   onReset={() => console.log('Reset clicked')}
 *   onApply={() => console.log('Apply clicked')}
 *   initialFilters={{ minRating: 3, studentName: 'Alice' }}
 *   locale="en"
 * />
 * ```
 */
export const ReviewFilterModal: React.FC<ReviewFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    locale,
}) => {
    const dictionary = getDictionary(locale).components.reviewFilterModal;

    const [filters, setFilters] = useState<Partial<ReviewFilterModel>>({
        minRating: initialFilters.minRating,
        maxRating: initialFilters.maxRating,
        studentName: initialFilters.studentName || '',
        courseName: initialFilters.courseName || '',
        dateAfter: initialFilters.dateAfter,
        dateBefore: initialFilters.dateBefore,
    });

    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setFilters({
            minRating: undefined,
            maxRating: undefined,
            studentName: undefined,
            courseName: undefined,
            dateAfter: undefined,
            dateBefore: undefined,
        });
        setResetKey((prev) => prev + 1);
    };

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };


    return (
        <div className="flex flex-col gap-4 bg-card-fill text-text-primary w-full max-h-[70vh] p-2 rounded-md relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{dictionary.title}</h2>
                {/* Empty div to keep title centered */}
                <div className="w-8" />
            </div>

            <Button
                variant="text"
                size="small"
                onClick={onClose}
                className="absolute top-2 right-4 z-10 p-0"
                hasIconRight
                iconRight={<IconClose size="8" />}
            />

            <div className="h-px w-full bg-divider"></div>

            {/* Rating Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.ratingFilter}</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-sm w-32">{dictionary.minimumRatingPlaceholder}</p>
                        <StarRatingInput
                            totalStars={5}
                            size={20}
                            type="single"
                            onChange={({ single }) => handleChange('minRating', single)}
                        />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-sm w-32">{dictionary.maximumRatingPlaceholder}</p>
                        <StarRatingInput
                            totalStars={5}
                            size={20}
                            type="single"
                            onChange={({ single }) => handleChange('maxRating', single)}
                        />
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-divider"></div>

            {/* Student Name Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.studentNameFilter}</h3>
                <TextInput
                    label={dictionary.studentNameLabel}
                    key={`studentName-${resetKey}`}
                    inputField={{
                        id: 'studentName',
                        className: "w-full text-white border-input-stroke",
                        defaultValue: filters.studentName,
                        setValue: (value: string) => handleChange('studentName', value),
                        inputText: dictionary.studentNamePlaceholder,
                    }}
                />
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Course Name Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.courseNameFilter}</h3>
                <TextInput
                    label={dictionary.courseNameLabel}
                    key={`courseName-${resetKey}`}
                    inputField={{
                        id: 'courseName',
                        className: "w-full text-white border-input-stroke",
                        defaultValue: filters.courseName,
                        setValue: (value: string) => handleChange('courseName', value),
                        inputText: dictionary.courseNamePlaceholder,
                    }}
                />
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Date Range Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.lastAccessFilter}</h3>
                <DateInput
                    label={dictionary.after}
                    value={filters.dateAfter || ''}
                    onChange={(value: string) => handleChange('dateAfter', value)}
                    locale={locale}
                />
                <DateInput
                    label={dictionary.before}
                    value={filters.dateBefore || ''}
                    onChange={(value: string) => handleChange('dateBefore', value)}
                    locale={locale}
                />
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Buttons */}
            <div className="flex gap-2 p-4">
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
    );
};
