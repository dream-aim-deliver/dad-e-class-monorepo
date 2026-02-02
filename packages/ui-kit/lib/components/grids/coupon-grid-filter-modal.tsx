'use client';

import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { TextInput } from '../text-input';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface CouponFilterModel {
    status?: ('active' | 'revoked')[];
    minUsagesLeft?: number;
    maxUsagesLeft?: number;
    createdAfter?: string;
    createdBefore?: string;
    expiresAfter?: string;
    expiresBefore?: string;
    outcomeTypes?: ('groupCourse' | 'freeCoachingSession' | 'discountOnEverything' | 'freeCourses' | 'freePackages')[];
}

export interface CouponGridFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: CouponFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<CouponFilterModel>;
}

export const CouponGridFilterModal: React.FC<CouponGridFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    locale,
}) => {
    const dictionary = getDictionary(locale).components.couponGridFilterModal;

    const [filters, setFilters] = useState<Partial<CouponFilterModel>>({
        status: initialFilters.status || [],
        minUsagesLeft: initialFilters.minUsagesLeft,
        maxUsagesLeft: initialFilters.maxUsagesLeft,
        createdAfter: initialFilters.createdAfter,
        createdBefore: initialFilters.createdBefore,
        expiresAfter: initialFilters.expiresAfter,
        expiresBefore: initialFilters.expiresBefore,
        outcomeTypes: initialFilters.outcomeTypes || [],
    });

    // This key is required to force re-render the modal when filters are reset.
    const [resetKey, setResetKey] = useState(0);

    const handleChange = (field: keyof CouponFilterModel, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayValue = <T,>(arr: T[] | undefined, value: T): T[] => {
        const current = arr || [];
        return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    };

    const handleStatusToggle = (value: 'active' | 'revoked') => {
        setFilters((prev) => ({ ...prev, status: toggleArrayValue(prev.status, value) }));
    };

    const handleOutcomeToggle = (value: 'groupCourse' | 'freeCoachingSession' | 'discountOnEverything' | 'freeCourses' | 'freePackages') => {
        setFilters((prev) => ({ ...prev, outcomeTypes: toggleArrayValue(prev.outcomeTypes, value) }));
    };

    const handleReset = () => {
        setFilters({
            status: [],
            minUsagesLeft: undefined,
            maxUsagesLeft: undefined,
            createdAfter: undefined,
            createdBefore: undefined,
            expiresAfter: undefined,
            expiresBefore: undefined,
            outcomeTypes: [],
        });
        setResetKey((prev) => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as CouponFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 pt-16" onClick={onClose}>
            <div className="flex flex-col gap-2 p-6 bg-card-fill text-text-primary border border-card-stroke w-full max-w-[350px] h-full max-h-[85vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{dictionary.title}</h2>
                    <div className="flex top-0 right-0 p-0">
                    <Button variant="text" size="small" hasIconLeft iconLeft={<IconClose size="6" />} onClick={onClose} />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Status Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.statusFilter}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <CheckBox
                            name="status-active"
                            value="active"
                            label={dictionary.activeLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.status || []).includes('active')}
                            withText
                            onChange={() => handleStatusToggle('active')}
                        />
                        <CheckBox
                            name="status-revoked"
                            value="revoked"
                            label={dictionary.revokedLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.status || []).includes('revoked')}
                            withText
                            onChange={() => handleStatusToggle('revoked')}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Usages Left Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.usagesLeftFilter}</h3>
                    <div className="flex gap-2">
                        <TextInput
                            label={dictionary.min}
                            key={`minUsagesLeft-${resetKey}`}
                            inputField={{
                                id: 'minUsagesLeft',
                                className: 'w-full text-white border-input-stroke',
                                defaultValue: filters.minUsagesLeft?.toString(),
                                setValue: (value: string) => handleChange('minUsagesLeft', parseInt(value) || undefined),
                                inputText: dictionary.minimumUsagesPlaceholder,
                            }}
                        />
                        <TextInput
                            label={dictionary.max}
                            key={`maxUsagesLeft-${resetKey}`}
                            inputField={{
                                id: 'maxUsagesLeft',
                                className: 'w-full text-white border-input-stroke',
                                defaultValue: filters.maxUsagesLeft?.toString(),
                                setValue: (value: string) => handleChange('maxUsagesLeft', parseInt(value) || undefined),
                                inputText: dictionary.maximumUsagesPlaceholder,
                            }}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Creation Date Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.creationDateFilter}</h3>
                    <DateInput
                        label={dictionary.createdAfter}
                        value={filters.createdAfter || ''}
                        onChange={(value: string) => handleChange('createdAfter', value)}
                        locale={locale}
                    />
                    <DateInput
                        label={dictionary.createdBefore}
                        value={filters.createdBefore || ''}
                        onChange={(value: string) => handleChange('createdBefore', value)}
                        locale={locale}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Expiration Date Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.expirationDateFilter}</h3>
                    <DateInput
                        label={dictionary.expiresAfter}
                        value={filters.expiresAfter || ''}
                        onChange={(value: string) => handleChange('expiresAfter', value)}
                        locale={locale}
                    />
                    <DateInput
                        label={dictionary.expiresBefore}
                        value={filters.expiresBefore || ''}
                        onChange={(value: string) => handleChange('expiresBefore', value)}
                        locale={locale}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Outcome Type Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.outcomeTypeFilter}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <CheckBox
                            name="outcome-group-course"
                            value="groupCourse"
                            label={dictionary.groupCourseLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.outcomeTypes || []).includes('groupCourse')}
                            withText
                            onChange={() => handleOutcomeToggle('groupCourse')}
                        />
                        <CheckBox
                            name="outcome-coaching"
                            value="freeCoachingSession"
                            label={dictionary.coachingLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.outcomeTypes || []).includes('freeCoachingSession')}
                            withText
                            onChange={() => handleOutcomeToggle('freeCoachingSession')}
                        />
                        <CheckBox
                            name="outcome-discount"
                            value="discountOnEverything"
                            label={dictionary.discountLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.outcomeTypes || []).includes('discountOnEverything')}
                            withText
                            onChange={() => handleOutcomeToggle('discountOnEverything')}
                        />
                        <CheckBox
                            name="outcome-free"
                            value="freeCourses"
                            label={dictionary.freeCoursesLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.outcomeTypes || []).includes('freeCourses')}
                            withText
                            onChange={() => handleOutcomeToggle('freeCourses')}
                        />
                        <CheckBox
                            name="outcome-free-bundles"
                            value="freePackages"
                            label={dictionary.freePackagesLabel}
                            labelClass="text-white text-sm"
                            checked={(filters.outcomeTypes || []).includes('freePackages')}
                            withText
                            onChange={() => handleOutcomeToggle('freePackages')}
                        />
                    </div>
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


