'use client';

import React, { useState } from 'react';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { DateInput } from '../date-input';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';

export interface CoachingSessionFilterModel {
    minRating?: number;
    maxRating?: number;
    courseName?: string;
    dateAfter?: string;
    dateBefore?: string;
    minParticipants?: number;
    maxParticipants?: number;
}

interface CoachingSessionFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: CoachingSessionFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<CoachingSessionFilterModel>;
}

/**
 * CoachingSessionFilterModal is a reusable modal component for filtering coaching sessions in a grid or list.
 *
 * @param onApplyFilters Callback function triggered when the user applies filters. Receives the current `CoachingSessionFilterModel` object.
 * @param onClose Callback function triggered when the modal is closed (background or close button).
 * @param initialFilters Optional initial filter values to pre-populate the modal fields.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * ```tsx
 * <CoachingSessionFilterModal
 *   onApplyFilters={(filters) => console.log('Filters applied:', filters)}
 *   onClose={() => console.log('Modal closed')}
 *   initialFilters={{ minRating: 3, courseName: 'Mathematics' }}
 *   locale="en"
 * />
 * ```
 */
export const CoachingSessionFilterModal: React.FC<CoachingSessionFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    locale,
}) => {
    const dictionary = getDictionary(locale).components.coachingSessionFilterModal;

    const [filters, setFilters] = useState<Partial<CoachingSessionFilterModel>>({
        minRating: initialFilters.minRating || 1,
        maxRating: initialFilters.maxRating || 5,
        courseName: initialFilters.courseName || '',
        dateAfter: initialFilters.dateAfter,
        dateBefore: initialFilters.dateBefore,
        minParticipants: initialFilters.minParticipants,
        maxParticipants: initialFilters.maxParticipants,
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

    const handleParticipantChange = (field: 'minParticipants' | 'maxParticipants', value: string) => {
        const numValue = parseInt(value) || undefined;
        setFilters((prev) => ({ ...prev, [field]: numValue }));
    };

    const handleReset = () => {
        setFilters({
            minRating: 1,
            maxRating: 5,
            courseName: '',
            dateAfter: '',
            dateBefore: '',
            minParticipants: undefined,
            maxParticipants: undefined,
        });
        setResetKey((prev) => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as CoachingSessionFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 mt-12" onClick={onClose}>
            <div className="relative flex flex-col gap-4 p-6 bg-card-fill text-text-primary w-full md:max-w-[450px] max-h-[85vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{dictionary.title}</h2>
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
                                    inputText: dictionary.minimumRatingPlaceholder,
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
                                    inputText: dictionary.maximumRatingPlaceholder,
                                    type: 'number',
                                    min: 1,
                                    max: 5,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Course Name Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.courseNameFilter}</h3>
                    <TextInput
                        key={`courseName-${resetKey}`}
                        inputField={{
                            id: 'courseName',
                            className: 'w-full text-white border-input-stroke',
                            defaultValue: filters.courseName,
                            setValue: (value: string) => handleChange('courseName', value),
                            inputText: dictionary.courseNamePlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Participants Count Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.participantsFilter}</h3>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <TextInput
                                key={`minParticipants-${resetKey}`}
                                inputField={{
                                    id: 'minParticipants',
                                    className: 'w-full text-white border-input-stroke',
                                    defaultValue: filters.minParticipants?.toString() || '',
                                    setValue: (value: string) => handleParticipantChange('minParticipants', value),
                                    inputText: dictionary.minParticipantsPlaceholder,
                                    type: 'number',
                                    min: 0,
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <TextInput
                                key={`maxParticipants-${resetKey}`}
                                inputField={{
                                    id: 'maxParticipants',
                                    className: 'w-full text-white border-input-stroke',
                                    defaultValue: filters.maxParticipants?.toString() || '',
                                    setValue: (value: string) => handleParticipantChange('maxParticipants', value),
                                    inputText: dictionary.maxParticipantsPlaceholder,
                                    type: 'number',
                                    min: 0,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Date Range Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.sessionDateFilter}</h3>
                    <DateInput
                        label={dictionary.after}
                        value={filters.dateAfter || ''}
                        onChange={(value: string) => handleChange('dateAfter', value)}
                        locale={locale as TLocale}
                    />
                    <DateInput
                        label={dictionary.before}
                        value={filters.dateBefore || ''}
                        onChange={(value: string) => handleChange('dateBefore', value)}
                        locale={locale as TLocale}
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