import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { RadioButton } from '../radio-button';
import { AutocompleteInput } from '../admin-course-filters-expanded';
import { TBasePersonalProfile } from '../../../../models/src/profile';
import { IconClose } from '../icons/icon-close';

// User filter interface extending TBasePersonalProfile
export interface UserFilterModel extends TBasePersonalProfile {
    userId: number;
    minRating?: number;
    maxRating?: number;
    platform?: string[];
    minCoachingSessions?: string;
    maxCoachingSessions?: string;
    minCoursesBought?: string;
    maxCoursesBought?: string;
    minCoursesCreated?: string;
    maxCoursesCreated?: string;
    lastAccessAfter?: string;
    lastAccessBefore?: string;
}

interface UserGridFilterModalProps {
    onApplyFilters: (filters: UserFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<UserFilterModel>;
    platforms: string[];
}

export const UserGridFilterModal: React.FC<UserGridFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    platforms,
}) => {
    const [filters, setFilters] = useState<Partial<UserFilterModel>>({
        minRating: initialFilters.minRating || 0,
        maxRating: initialFilters.maxRating || 5,
        platform: initialFilters.platform || [],
        minCoachingSessions: initialFilters.minCoachingSessions || '',
        maxCoachingSessions: initialFilters.maxCoachingSessions || '',
        minCoursesBought: initialFilters.minCoursesBought || '',
        maxCoursesBought: initialFilters.maxCoursesBought || '',
        minCoursesCreated: initialFilters.minCoursesCreated || '',
        maxCoursesCreated: initialFilters.maxCoursesCreated || '',
        lastAccessAfter: initialFilters.lastAccessAfter || '',
        lastAccessBefore: initialFilters.lastAccessBefore || '',
    });

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handlePlatformToggle = (platform: string) => {
        setFilters((prev) => {
            const currentPlatforms = prev.platform || [];
            const updatedPlatforms = currentPlatforms.includes(platform)
                ? currentPlatforms.filter((p) => p !== platform)
                : [...currentPlatforms, platform];
            return { ...prev, platform: updatedPlatforms };
        });
    };

    const handleReset = () => {
        setFilters({
            minRating: 0,
            maxRating: 5,
            platform: [],
            minCoachingSessions: '',
            maxCoachingSessions: '',
            minCoursesBought: '',
            maxCoursesBought: '',
            minCoursesCreated: '',
            maxCoursesCreated: '',
            lastAccessAfter: '',
            lastAccessBefore: '',
        });
    };

    const handleApply = () => {
        onApplyFilters(filters as UserFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50">
            <div className="flex flex-col gap-2 p-6 bg-card-fill text-text-primary w-full max-w-[350px] h-full max-h-[90vh] overflow-y-auto rounded-md">

                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">User Filters</h2>
                    <div className="flex top-0 right-0 p-0">
                        <Button variant="text" size="small" hasIconLeft iconLeft={<IconClose size="6" />} onClick={onClose} />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Rating Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Rating</h3>
                    <div className="flex gap-2">
                        <AutocompleteInput
                            label="Min"
                            inputField={{
                                id: 'minRating',
                                className: "w-full text-white border-input-stroke",
                                value: filters.minRating?.toString() || '',
                                setValue: (value: string) => handleChange('minRating', parseFloat(value) || 0),
                                inputText: 'e.g. 1',
                            }}
                        />
                        <AutocompleteInput
                            label="Max"
                            inputField={{
                                id: 'maxRating',
                                className: "w-full text-white border-input-stroke",
                                value: filters.maxRating?.toString() || '',
                                setValue: (value: string) => handleChange('maxRating', parseFloat(value) || 5),
                                inputText: 'e.g. 5',
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Platform Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Platform</h3>
                    <div className="grid grid-cols-2 gap-3 line-clamp-3">
                        {platforms.map((platform) => (
                            <CheckBox
                                key={platform}
                                name={platform}
                                value={platform}
                                label={platform}
                                labelClass="text-white text-sm"
                                checked={(filters.platform || []).includes(platform)}
                                withText
                                onChange={() => handlePlatformToggle(platform)}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Coaching Sessions Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Coaching Sessions</h3>
                    <div className="flex gap-2">
                        <AutocompleteInput
                            label="Min"
                            inputField={{
                                id: 'minCoachingSessions',
                                className: "w-full text-white border-input-stroke",
                                value: filters.minCoachingSessions || '',
                                setValue: (value: string) => handleChange('minCoachingSessions', value),
                                inputText: 'e.g. 5',
                            }}
                        />
                        <AutocompleteInput
                            label="Max"
                            inputField={{
                                id: 'maxCoachingSessions',
                                className: "w-full text-white border-input-stroke",
                                value: filters.maxCoachingSessions || '',
                                setValue: (value: string) => handleChange('maxCoachingSessions', value),
                                inputText: 'e.g. 50',
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Courses Bought Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Courses Bought</h3>
                    <div className="flex gap-2">
                        <AutocompleteInput
                            label="Min"
                            inputField={{
                                id: 'minCoursesBought',
                                className: "w-full text-white border-input-stroke",
                                value: filters.minCoursesBought || '',
                                setValue: (value: string) => handleChange('minCoursesBought', value),
                                inputText: 'e.g. 1',
                            }}
                        />
                        <AutocompleteInput
                            label="Max"
                            inputField={{
                                id: 'maxCoursesBought',
                                className: "w-full text-white border-input-stroke",
                                value: filters.maxCoursesBought || '',
                                setValue: (value: string) => handleChange('maxCoursesBought', value),
                                inputText: 'e.g. 20',
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Courses Created Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Courses Created</h3>
                    <div className="flex gap-2">
                        <AutocompleteInput
                            label="Min"
                            inputField={{
                                id: 'minCoursesCreated',
                                className: "w-full text-white border-input-stroke",
                                value: filters.minCoursesCreated || '',
                                setValue: (value: string) => handleChange('minCoursesCreated', value),
                                inputText: 'e.g. 0',
                            }}
                        />
                        <AutocompleteInput
                            label="Max"
                            inputField={{
                                id: 'maxCoursesCreated',
                                className: "w-full text-white border-input-stroke",
                                value: filters.maxCoursesCreated || '',
                                setValue: (value: string) => handleChange('maxCoursesCreated', value),
                                inputText: 'e.g. 10',
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Last Access Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Last Access</h3>
                    <DateInput
                        label="After"
                        value={filters.lastAccessAfter || ''}
                        onChange={(value: string) => handleChange('lastAccessAfter', value)}
                    />
                    <DateInput
                        label="Before"
                        value={filters.lastAccessBefore || ''}
                        onChange={(value: string) => handleChange('lastAccessBefore', value)}
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
                        text="Reset filters"
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleApply}
                        className="flex-1"
                        text="Apply filters"
                    />
                </div>
            </div>
        </div>
    );
};