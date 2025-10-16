'use client';

import React from 'react';
import { TextInput } from '../text-input';

type PartialDiscounts = Record<string, string>;

export interface PackagePricingConfig {
    completePackageWithCoaching: string;
    completePackageWithoutCoaching: string;
    partialDiscounts: PartialDiscounts;
}

interface PackagePricingStepProps {
    pricingConfig: PackagePricingConfig;
    onUpdatePricingConfig: (updates: Partial<PackagePricingConfig>) => void;
    onUpdatePartialDiscount: (courseCount: string, discount: string) => void;
}

/**
 * PackagePricingStep
 *
 * A component for Step 3 of the Create Package flow, handling pricing configuration
 * for complete packages (with/without coaching) and partial package discounts
 * when users select only some courses.
 *
 * Features:
 * - Inputs for complete package price with coaching
 * - Inputs for complete package price without coaching
 * - Grid of percentage discounts for partial selections by course count
 *
 * Props:
 * @param {PackagePricingConfig} pricingConfig - Current pricing configuration state
 * @param {function} onUpdatePricingConfig - Function to update top-level pricing fields
 * @param {function} onUpdatePartialDiscount - Function to update a single partial discount by course count
 *
 * Usage:
 * ```tsx
 * <PackagePricingStep
 *   pricingConfig={pricingConfig}
 *   onUpdatePricingConfig={updatePricingConfig}
 *   onUpdatePartialDiscount={updatePartialDiscount}
 * />
 * ```
 */

export const PackagePricingStep: React.FC<PackagePricingStepProps> = ({
    pricingConfig,
    onUpdatePricingConfig,
    onUpdatePartialDiscount,
}) => {
    return (
        <div className="flex flex-col border border-card-stroke bg-card-fill p-6 gap-6 w-full rounded-medium">
            <h3 className="text-text-primary">
                Choose Pricing
            </h3>

            {/* Complete Package Section */}
            <div className="flex flex-col space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Complete package</h3>

                <div className="flex flex-col space-y-4">
                    {/* With Coaching */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-text-secondary">With coaching</label>
                        <TextInput
                            inputField={{
                                inputText: 'e.g. 5400 CHF',
                                value: pricingConfig.completePackageWithCoaching,
                                setValue: (value: string) => onUpdatePricingConfig({ completePackageWithCoaching: value }),
                            }}
                        />
                    </div>

                    {/* Without Coaching */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-text-secondary">Without coaching</label>
                        <TextInput
                            inputField={{
                                inputText: 'e.g. 5400 CHF',
                                value: pricingConfig.completePackageWithoutCoaching,
                                setValue: (value: string) => onUpdatePricingConfig({ completePackageWithoutCoaching: value }),
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Partial Package Discounts Section */}
            <div className="flex flex-col space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Partial package discounts</h3>

                <p className="text-text-secondary">
                    If the user selects only some courses, they will receive a percentage discount compared to purchasing each course individually. This discount applies whether or not they choose to include coaching.
                </p>

                {/* Discount Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {Object.entries(pricingConfig.partialDiscounts).map(([courseCount, discount]) => (
                        <div key={courseCount} className="flex flex-col space-y-2">
                            <label className="text-sm text-text-secondary">{courseCount} courses</label>
                            <TextInput
                                inputField={{
                                    inputText: 'e.g. 20%',
                                    value: discount,
                                    setValue: (value: string) => onUpdatePartialDiscount(courseCount, value),
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



