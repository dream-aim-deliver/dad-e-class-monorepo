'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { TextInput } from '../text-input';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';

export interface TransactionFilterModel {
    status?: string[];
    state?: ('created')[];
    types?: ('coachPayment' | 'course' | 'coachingOffers' | 'package')[];
    direction?: 'incoming' | 'outgoing';
    currencies?: string[];
    minAmount?: number;
    maxAmount?: number;
    createdAfter?: string; // ISO
    createdBefore?: string; // ISO
    settledAfter?: string; // ISO
    settledBefore?: string; // ISO
    tagIds?: (string | number)[];
}

export interface TransactionsGridFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: TransactionFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<TransactionFilterModel>;
    locale: TLocale;
    availableTags?: { id: string | number; name: string }[];
}

export const TransactionsGridFilterModal: React.FC<TransactionsGridFilterModalProps> = ({ onApplyFilters, onClose, initialFilters = {}, locale, availableTags = [] }) => {
    // Use the dedicated translations section for transactions filter modal
    const dictionary = getDictionary(locale).components.transactionsGridFilterModal;

    // Initialize with explicit defaults for array fields, mirroring coupon modal behavior
    const [filters, setFilters] = useState<Partial<TransactionFilterModel>>({
        status: initialFilters.status || [],
        state: initialFilters.state || [],
        types: initialFilters.types || [],
        direction: initialFilters.direction,
        currencies: initialFilters.currencies || [],
        minAmount: initialFilters.minAmount,
        maxAmount: initialFilters.maxAmount,
        createdAfter: initialFilters.createdAfter,
        createdBefore: initialFilters.createdBefore,
        settledAfter: initialFilters.settledAfter,
        settledBefore: initialFilters.settledBefore,
        tagIds: initialFilters.tagIds || [],
    });

    // This key is required to force re-render of text inputs when filters are reset
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            status: initialFilters.status || prev.status || [],
            state: initialFilters.state || prev.state || [],
            types: initialFilters.types || prev.types || [],
            direction: initialFilters.direction ?? prev.direction,
            currencies: initialFilters.currencies || prev.currencies || [],
            minAmount: initialFilters.minAmount ?? prev.minAmount,
            maxAmount: initialFilters.maxAmount ?? prev.maxAmount,
            createdAfter: initialFilters.createdAfter ?? prev.createdAfter,
            createdBefore: initialFilters.createdBefore ?? prev.createdBefore,
            settledAfter: initialFilters.settledAfter ?? prev.settledAfter,
            settledBefore: initialFilters.settledBefore ?? prev.settledBefore,
            tagIds: initialFilters.tagIds || prev.tagIds || [],
        }));
    }, [initialFilters]);

    const handleChange = (field: keyof TransactionFilterModel, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayValue = <T,>(arr: T[] | undefined, value: T): T[] => {
        const current = arr || [];
        return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    };

    const handleStatusToggle = (value: string) => {
        setFilters((prev) => ({ ...prev, status: toggleArrayValue(prev.status, value) }));
    };

    const handleStateToggle = () => {
        setFilters((prev) => ({ ...prev, state: toggleArrayValue(prev.state, 'created') }));
    };

    const handleTypeToggle = (value: 'coachPayment' | 'course' | 'coachingOffers' | 'package') => {
        setFilters((prev) => ({ ...prev, types: toggleArrayValue(prev.types, value) }));
    };

    const handleDirectionToggle = (value: 'incoming' | 'outgoing') => {
        setFilters((prev) => ({ ...prev, direction: prev.direction === value ? undefined : value }));
    };

    const handleTagToggle = (tagId: string | number) => {
        setFilters((prev) => ({ ...prev, tagIds: toggleArrayValue(prev.tagIds, tagId) }));
    };

    const handleReset = () => {
        setFilters({
            status: [],
            state: [],
            types: [],
            direction: undefined,
            currencies: [],
            minAmount: undefined,
            maxAmount: undefined,
            createdAfter: undefined,
            createdBefore: undefined,
            settledAfter: undefined,
            settledBefore: undefined,
            tagIds: [],
        });
        setResetKey((prev) => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as TransactionFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="flex flex-col bg-card-fill border border-card-stroke text-text-primary w-full max-w-[400px] max-h-[80vh] rounded-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Fixed Header */}
                <div className="flex-shrink-0 flex flex-col gap-2 p-6 pb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{dictionary.title}</h2>
                        <Button variant="text" size="small" hasIconLeft iconLeft={<IconClose size="6" />} onClick={onClose} />
                    </div>
                    <div className="h-px w-full bg-divider"></div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-2">

                {/* Status Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.statusFilter}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['pending', 'paid', 'failed', 'refunded', 'void'].map((s) => (
                            <CheckBox
                                key={s}
                                name={`status-${s}`}
                                value={s}
                                label={s}
                                labelClass="text-white text-sm"
                                checked={(filters.status || []).includes(s)}
                                withText
                                onChange={() => handleStatusToggle(s)}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* State Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.stateFilter}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <CheckBox
                            name="state-created"
                            value="created"
                            label="created"
                            labelClass="text-white text-sm"
                            checked={(filters.state || []).includes('created')}
                            withText
                            onChange={handleStateToggle}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Type Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.typeFilter}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(['coachPayment', 'course', 'coachingOffers', 'package'] as const).map((type) => (
                            <CheckBox
                                key={type}
                                name={`type-${type}`}
                                value={type}
                                label={type}
                                labelClass="text-white text-sm"
                                checked={(filters.types || []).includes(type)}
                                withText
                                onChange={() => handleTypeToggle(type)}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Direction Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.directionFilter}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(['incoming', 'outgoing'] as const).map((d) => (
                            <CheckBox
                                key={d}
                                name={`direction-${d}`}
                                value={d}
                                label={d}
                                labelClass="text-white text-sm"
                                checked={filters.direction === d}
                                withText
                                onChange={() => handleDirectionToggle(d)}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Currency Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.currencyFilter}</h3>
                    <TextInput
                        label={dictionary.currenciesLabel}
                        key={`currencies-${resetKey}`}
                        inputField={{
                            id: 'currencies',
                            className: 'w-full text-white border-input-stroke',
                            defaultValue: (filters.currencies || []).join(', '),
                            setValue: (value: string) => handleChange('currencies', value ? value.split(',').map((s) => s.trim()).filter(Boolean) : []),
                            inputText: dictionary.currenciesPlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Amount Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.amountFilter}</h3>
                    <div className="flex gap-2">
                        <TextInput
                            label={dictionary.min}
                            key={`minAmount-${resetKey}`}
                            inputField={{
                                id: 'minAmount',
                                className: 'w-full text-white border-input-stroke',
                                defaultValue: filters.minAmount?.toString(),
                                setValue: (value: string) => handleChange('minAmount', value ? Number(value) : undefined),
                                inputText: '0',
                            }}
                        />
                        <TextInput
                            label={dictionary.max}
                            key={`maxAmount-${resetKey}`}
                            inputField={{
                                id: 'maxAmount',
                                className: 'w-full text-white border-input-stroke',
                                defaultValue: filters.maxAmount?.toString(),
                                setValue: (value: string) => handleChange('maxAmount', value ? Number(value) : undefined),
                                inputText: '1000',
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

                {/* Settlement Date Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.settledDateFilter}</h3>
                    <DateInput
                        label={dictionary.settledAfter}
                        value={filters.settledAfter || ''}
                        onChange={(value: string) => handleChange('settledAfter', value)}
                        locale={locale}
                    />
                    <DateInput
                        label={dictionary.settledBefore}
                        value={filters.settledBefore || ''}
                        onChange={(value: string) => handleChange('settledBefore', value)}
                        locale={locale}
                    />
                </div>

                {/* Tags Section */}
                {availableTags.length > 0 && (
                    <>
                        <div className="h-px w-full bg-divider"></div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold">{dictionary.tagsFilter}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {availableTags.map((tag) => (
                                    <CheckBox
                                        key={String(tag.id)}
                                        name={`tag-${tag.id}`}
                                        value={String(tag.id)}
                                        label={tag.name}
                                        labelClass="text-white text-sm"
                                        checked={(filters.tagIds || []).includes(tag.id)}
                                        withText
                                        onChange={() => handleTagToggle(tag.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
                </div>

                {/* Fixed Footer */}
                <div className="flex-shrink-0 flex flex-col gap-2 p-6 pt-4 border-t border-divider">
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
        </div>
    );
};


