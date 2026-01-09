'use client';

import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { profile } from '@maany_shr/e-class-models';
import { IconClose } from '../icons/icon-close';
import { TextInput } from '../text-input';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

// User filter interface extending TBasePersonalProfile
export interface UserFilterModel extends profile.TBasePersonalProfile {
    userId: number;
    minRating?: number;
    maxRating?: number;
    platform?: string[];
    minCoachingSessions?: number;
    maxCoachingSessions?: number;
    minCoursesBought?: number;
    maxCoursesBought?: number;
    minCoursesCreated?: number;
    maxCoursesCreated?: number;
    lastAccessAfter?: string;
    lastAccessBefore?: string;
}

interface UserGridFilterModalProps extends isLocalAware {
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
    locale,
}) => {

    const dictionary = getDictionary(locale).components.userGridFilterModal;

    const [filters, setFilters] = useState<Partial<UserFilterModel>>({
        minRating: initialFilters.minRating,
        maxRating: initialFilters.maxRating,
        platform: initialFilters.platform || [],
        minCoachingSessions: initialFilters.minCoachingSessions,
        maxCoachingSessions: initialFilters.maxCoachingSessions,
        minCoursesBought: initialFilters.minCoursesBought,
        maxCoursesBought: initialFilters.maxCoursesBought,
        minCoursesCreated: initialFilters.minCoursesCreated,
        maxCoursesCreated: initialFilters.maxCoursesCreated,
        lastAccessAfter: initialFilters.lastAccessAfter,
        lastAccessBefore: initialFilters.lastAccessBefore,
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

    // This key is required to force re-render the modal when filters are reset.
    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setFilters({
            minRating: undefined,
            maxRating: undefined,
            platform: [],
            minCoachingSessions: undefined,
            maxCoachingSessions: undefined,
            minCoursesBought: undefined,
            maxCoursesBought: undefined,
            minCoursesCreated: undefined,
            maxCoursesCreated: undefined,
            lastAccessAfter: undefined,
            lastAccessBefore: undefined,
        });
        setResetKey(prev => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as UserFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 pt-16" onClick={onClose}>
            <div className="flex flex-col gap-2 p-6 bg-card-fill text-text-primary w-full max-w-[450px] h-full max-h-[85vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
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
                                // We can't control the input with value property, as this will not fire updates until the value is a valid float.
                                defaultValue: filters.minRating?.toString(),
                                // TODO: possibly check if the value is in range of 0-5
                                setValue: (value: string) =>
                                    handleChange('minRating', parseFloat(value) || undefined),
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
                                setValue: (value: string) =>
                                    handleChange('maxRating', parseFloat(value) || undefined),
                                inputText: dictionary.maximumRatingPlaceholder,
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Platform Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.platformFilter}</h3>
                    <div className="grid grid-cols-2 gap-3 line-clamp-3">
                        {platforms.map((platform) => (
                            <CheckBox
                                key={platform}
                                name={platform}
                                value={platform}
                                label={
                                    <span
                                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={platform}
                                    >
                                        {platform}
                                    </span>
                                }
                                labelClass="text-white text-sm w-full"
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
                    <h3 className="text-xl font-semibold">{dictionary.coachingSessionFilter}</h3>
                    <div className="flex gap-2">
                        <TextInput
                            key={`minCoachingSessions-${resetKey}`}
                            label={dictionary.min}
                            inputField={{
                                id: 'minCoachingSessions',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.minCoachingSessions?.toString(),
                                setValue: (value: string) =>
                                    handleChange('minCoachingSessions', parseInt(value) || undefined),
                                inputText: dictionary.minimumCoachingSessionsPlaceholder,
                            }}
                        />
                        <TextInput
                            key={`maxCoachingSessions-${resetKey}`}
                            label={dictionary.max}
                            inputField={{
                                id: 'maxCoachingSessions',
                                className: "w-full text-white border-input-stroke",
                                value: filters.maxCoachingSessions?.toString(),
                                setValue: (value: string) =>
                                    handleChange('maxCoachingSessions', parseInt(value) || undefined),
                                inputText: dictionary.maximumCoachingSessionsPlaceholder,
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Courses Bought Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.coursesBoughtFilter}</h3>
                    <div className="flex gap-2">
                        <TextInput
                            label={dictionary.min}
                            key={`minCoursesBought-${resetKey}`}
                            inputField={{
                                id: 'minCoursesBought',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.minCoursesBought?.toString(),
                                setValue: (value: string) =>
                                    handleChange('minCoursesBought', parseInt(value) || undefined),
                                inputText: dictionary.minimumCoursesBoughtPlaceholder,
                            }}
                        />
                        <TextInput
                            label={dictionary.max}
                            key={`maxCoursesBought-${resetKey}`}
                            inputField={{
                                id: 'maxCoursesBought',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.maxCoursesBought?.toString(),
                                setValue: (value: string) =>
                                    handleChange('maxCoursesBought', parseInt(value) || undefined),
                                inputText: dictionary.maximumCoursesBoughtPlaceholder,
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Courses Created Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.coursesCreatedFilter}</h3>
                    <div className="flex gap-2">
                        <TextInput
                            label={dictionary.min}
                            key={`minCoursesCreated-${resetKey}`}
                            inputField={{
                                id: 'minCoursesCreated',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.minCoursesCreated?.toString(),
                                setValue: (value: string) =>
                                    handleChange('minCoursesCreated', parseInt(value) || undefined),
                                inputText: dictionary.minimumCoursesCreatedPlaceholder,
                            }}
                        />
                        <TextInput
                            label={dictionary.max}
                            key={`maxCoursesCreated-${resetKey}`}
                            inputField={{
                                id: 'maxCoursesCreated',
                                className: "w-full text-white border-input-stroke",
                                defaultValue: filters.maxCoursesCreated?.toString(),
                                setValue: (value: string) =>
                                    handleChange('maxCoursesCreated', parseInt(value) || undefined),
                                inputText: dictionary.maximumCoursesCreatedPlaceholder,
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Last Access Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.lastAccessFilter}</h3>
                    <DateInput
                        label={dictionary.before}
                        value={filters.lastAccessAfter || ''}
                        onChange={(value: string) => handleChange('lastAccessAfter', value)}
                        locale={locale}
                    />
                    <DateInput
                        label={dictionary.after}
                        value={filters.lastAccessBefore || ''}
                        onChange={(value: string) => handleChange('lastAccessBefore', value)}
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
