import { z } from 'zod';

/**
 * Error types for purchase eligibility rejections.
 * Frontend uses these for i18n.
 */
export const PurchaseEligibilityErrorTypeSchema = z.enum([
    'already_enrolled_in_course',
    'already_has_coaching_for_course',
    'package_already_purchased',
    'selected_courses_already_owned',
    'package_coaching_already_purchased',
    'not_enrolled_in_course',
    'already_has_coaching_for_component',
]);
export type TPurchaseEligibilityErrorType = z.infer<typeof PurchaseEligibilityErrorTypeSchema>;

/**
 * Adjustment reasons for upgrade scenarios.
 * Frontend uses these for i18n.
 */
export const PriceAdjustmentReasonSchema = z.enum([
    'coaching_upgrade_already_enrolled',
    'package_coaching_upgrade',
]);
export type TPriceAdjustmentReason = z.infer<typeof PriceAdjustmentReasonSchema>;

/**
 * Price adjustment for upgrade scenarios.
 */
export const PriceAdjustmentSchema = z.object({
    originalPrice: z.number(),
    adjustedPrice: z.number(),
    adjustmentReason: PriceAdjustmentReasonSchema,
    discountAmount: z.number(),
});
export type TPriceAdjustment = z.infer<typeof PriceAdjustmentSchema>;

/**
 * Result of purchase eligibility validation.
 */
export const PurchaseEligibilityResultSchema = z.object({
    isEligible: z.boolean(),
    errorType: PurchaseEligibilityErrorTypeSchema.optional(),
    priceAdjustment: PriceAdjustmentSchema.optional(),
    // Structured data for frontend i18n (NO English strings)
    conflictingCourseIds: z.array(z.number()).optional(),
    conflictingCourseNames: z.array(z.string()).optional(),
    conflictingPackageId: z.number().optional(),
    conflictingPackageName: z.string().optional(),
    conflictingComponentIds: z.array(z.string()).optional(),
});
export type TPurchaseEligibilityResult = z.infer<typeof PurchaseEligibilityResultSchema>;
