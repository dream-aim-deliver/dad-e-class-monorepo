import React from 'react';
import { TextInput } from '../text-input';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

type PartialDiscounts = Record<string, string>;

export interface PackagePricingFormData {
    completePackageWithCoaching: string;
    completePackageWithoutCoaching: string;
    partialDiscounts: PartialDiscounts;
}

export interface PackagePricingStepProps {
    formData: PackagePricingFormData;
    onFormDataChange: (updates: Partial<PackagePricingFormData>) => void;
    locale: TLocale;
    selectedCourseCount: number;
}

/**
 * PackagePricingStep
 *
 * A component for Step 3 of the Create Package flow, handling pricing configuration
 * for complete packages (with/without coaching) and partial package discounts
 * when users select only some courses. This component manages all pricing-related
 * inputs and calculations for the package creation workflow.
 *
 * Features:
 * - Complete package pricing with coaching inclusion option
 * - Complete package pricing without coaching option
 * - Dynamic discount grid for partial course selections
 * - Percentage-based discount calculations by course count
 * - Form validation and state management for pricing data
 * - Responsive grid layout for discount inputs
 *
 * Props:
 * @param {PackagePricingFormData} formData - Current pricing configuration state containing all pricing data
 * @param {function} onFormDataChange - Function to update pricing configuration with partial updates
 * @param {TLocale} locale - Current locale for translations
 *
 * Usage:
 * ```tsx
 * <PackagePricingStep
 *   formData={formData}
 *   onFormDataChange={onFormDataChange}
 *   locale={locale}
 * />
 * ```
 */

export const PackagePricingStep: React.FC<PackagePricingStepProps> = ({
    formData,
    onFormDataChange,
    locale,
    selectedCourseCount,
}) => {
    const dictionary = getDictionary(locale);
    const {
        completePackageWithCoaching,
        completePackageWithoutCoaching,
        partialDiscounts,
    } = formData;

    const eligiblePartialDiscounts = Object.entries(partialDiscounts).filter(
        ([courseCount]) => {
            const numericCount = Number(courseCount);
            if (Number.isNaN(numericCount)) {
                return false;
            }

            return (
                selectedCourseCount > 1 &&
                numericCount > 1 &&
                numericCount < selectedCourseCount
            );
        },
    );

    return (
        <div className="flex flex-col border border-card-stroke bg-card-fill p-6 gap-6 w-full rounded-medium">
            <h3 className="text-text-primary">
                {dictionary.components.packagePricingStep.title}
            </h3>

            {/* Complete Package Section */}
            <div className="flex flex-col space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">{dictionary.components.packagePricingStep.completePackageTitle}</h3>

                <p className="text-text-secondary">
                    {dictionary.components.packagePricingStep.completePackageDescription}
                </p>

                <div className="flex flex-col space-y-4">
                    {/* With Coaching */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-text-secondary">{dictionary.components.packagePricingStep.withCoachingLabel}</label>
                        <TextInput
                            inputField={{
                                inputText: dictionary.components.packagePricingStep.withCoachingPlaceholder,
                                value: completePackageWithCoaching,
                                setValue: (value: string) => onFormDataChange({ completePackageWithCoaching: value }),
                            }}
                        />
                    </div>

                    {/* Without Coaching */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-text-secondary">{dictionary.components.packagePricingStep.withoutCoachingLabel}</label>
                        <TextInput
                            inputField={{
                                inputText: dictionary.components.packagePricingStep.withoutCoachingPlaceholder,
                                value: completePackageWithoutCoaching,
                                setValue: (value: string) => onFormDataChange({ completePackageWithoutCoaching: value }),
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Partial Package Discounts Section */}
            <div className="flex flex-col space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">{dictionary.components.packagePricingStep.partialDiscountsTitle}</h3>

                <p className="text-text-secondary">
                    {dictionary.components.packagePricingStep.partialDiscountsDescription}
                </p>

                <p className="text-text-secondary">
                    {dictionary.components.packagePricingStep.partialDiscountsVisibilityNote}
                </p>

                {/* Discount Grid */}
                {eligiblePartialDiscounts.length > 0 && (
                    <div className="grid grid-cols-3 gap-6">
                        {eligiblePartialDiscounts.map(([courseCount, discount]) => (
                            <div key={courseCount} className="flex flex-col space-y-2">
                                <label className="text-sm text-text-secondary">{courseCount} {dictionary.components.packagePricingStep.coursesLabel}</label>
                                <TextInput
                                    inputField={{
                                        inputText: dictionary.components.packagePricingStep.discountPlaceholder,
                                        value: discount,
                                        setValue: (value: string) => {
                                            // Only allow numbers between 0 and 100
                                            const numericValue = value.replace(/[^\d]/g, '');
                                            const numValue = parseInt(numericValue);

                                            if (
                                                numericValue === '' ||
                                                (numValue >= 0 && numValue <= 100)
                                            ) {
                                                onFormDataChange({
                                                    partialDiscounts: {
                                                        ...partialDiscounts,
                                                        [courseCount]: numericValue,
                                                    },
                                                });
                                            }
                                        },
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



