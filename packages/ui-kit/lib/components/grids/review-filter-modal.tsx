import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { TextInput } from '../text-input';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

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

export const ReviewFilterModal: React.FC<ReviewFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    locale,
}) => {
    const dictionary = getDictionary(locale).components.reviewFilterModel;

    const [filters, setFilters] = useState<Partial<ReviewFilterModel>>({
        minRating: initialFilters.minRating,
        maxRating: initialFilters.maxRating,
        studentName: initialFilters.studentName || '',
        courseName: initialFilters.courseName || '',
        dateAfter: initialFilters.dateAfter,
        dateBefore: initialFilters.dateBefore,
    });

    const [resetKey, setResetKey] = useState(0);

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setFilters({
            minRating: undefined,
            maxRating: undefined,
            studentName: '',
            courseName: '',
            dateAfter: undefined,
            dateBefore: undefined,
        });
        setResetKey((prev) => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as ReviewFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50" onClick={onClose}>
            <div className="flex flex-col gap-2 p-6 bg-card-fill text-text-primary w-full max-w-[350px] h-full max-h-[90vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{dictionary.title}</h2>
                    <div className="flex top-0 right-0 p-0">
                        <Button variant="text" size="small" hasIconLeft iconLeft={<IconClose size="6" />} onClick={onClose} />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Rating Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.ratingFilter}</h3>
                    <div className="flex gap-2">
                        <TextInput
                            label={dictionary.min}
                            key={`minRating-${resetKey}`}
                            inputField={{
                                id: 'minRating',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.minRating?.toString(),
                                setValue: (value: string) => handleChange('minRating', parseFloat(value) || undefined),
                                inputText: dictionary.minimumRatingPlaceholder,
                            }}
                        />
                        <TextInput
                            label={dictionary.max}
                            key={`maxRating-${resetKey}`}
                            inputField={{
                                id: 'maxRating',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.maxRating?.toString(),
                                setValue: (value: string) => handleChange('maxRating', parseFloat(value) || undefined),
                                inputText: dictionary.maximumRatingPlaceholder,
                            }}
                        />
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
