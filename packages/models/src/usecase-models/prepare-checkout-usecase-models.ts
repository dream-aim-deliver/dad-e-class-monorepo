import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

/**
 * Purchase type discriminator
 */
export const PurchaseTypeSchema = z.enum([
    'StudentCoursePurchase',
    'StudentCoursePurchaseWithCoaching',
    'StudentPackagePurchase',
    'StudentPackagePurchaseWithCoaching',
    'StudentCoachingSessionPurchase',
]);
export type TPurchaseType = z.infer<typeof PurchaseTypeSchema>;

/**
 * Invoice line item
 */
export const InvoiceLineItemSchema = z.object({
    name: z.string(),
    description: z.string(),
    unitPrice: z.number().int(), // In cents
    quantity: z.number().int().min(1),
    totalPrice: z.number().int(), // In cents
});
export type TInvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;

/**
 * Transaction draft
 */
export const TransactionDraftSchema = z.object({
    invoiceLineItems: z.array(InvoiceLineItemSchema),
    currency: z.string(),
    couponCode: z.string().nullable().optional(),
    finalPrice: z.number().int(), // In cents
});
export type TTransactionDraft = z.infer<typeof TransactionDraftSchema>;

/**
 * Request to prepare checkout
 */
export const PrepareCheckoutRequestSchema = z.object({
    type: PurchaseTypeSchema,

    // For course purchases
    courseId: z.number().int().optional(),
    courseSlug: z.string().optional(),

    // For package purchases
    packageId: z.number().int().optional(),
    selectedCourseIds: z.array(z.number().int()).optional(),

    // For coaching purchases
    coachingOfferingId: z.number().int().optional(),
    quantity: z.number().int().min(1).optional(),

    // Optional coupon
    couponCode: z.string().nullable().optional(),
});
export type TPrepareCheckoutRequest = z.infer<typeof PrepareCheckoutRequestSchema>;

/**
 * Successful checkout preparation response
 */
export const PrepareCheckoutSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    transaction: TransactionDraftSchema,
}));
export type TPrepareCheckoutSuccessResponse = z.infer<typeof PrepareCheckoutSuccessResponseSchema>;

/**
 * Coupon error types
 */
export const CouponErrorTypeSchema = z.enum([
    'InvalidCouponType',
    'CouponNotFound',
    'CouponExpired',
    'CouponLimitReached',
]);
export type TCouponErrorType = z.infer<typeof CouponErrorTypeSchema>;

/**
 * Error response schema
 * The BaseErrorDiscriminatedUnionSchemaFactory handles the error structure
 */
const PrepareCheckoutUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TPrepareCheckoutUseCaseErrorResponse = z.infer<typeof PrepareCheckoutUseCaseErrorResponseSchema>;

/**
 * Complete prepare checkout response (success | error)
 */
export const PrepareCheckoutUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    PrepareCheckoutSuccessResponseSchema,
    PrepareCheckoutUseCaseErrorResponseSchema,
]);
export type TPrepareCheckoutUseCaseResponse = z.infer<typeof PrepareCheckoutUseCaseResponseSchema>;
