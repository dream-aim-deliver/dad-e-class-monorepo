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
 * Request to prepare checkout - Discriminated union based on purchase type
 */

// Base schema for common fields
const BasePrepareCheckoutRequestSchema = z.object({
    couponCode: z.string().nullable().optional(),
});

// Course purchase (without coaching)
const StudentCoursePurchaseRequestSchema = BasePrepareCheckoutRequestSchema.extend({
    type: z.literal('StudentCoursePurchase'),
    courseSlug: z.string(),
    // Legacy support
    courseId: z.number().int().optional(),
});

// Course purchase (with coaching)
const StudentCoursePurchaseWithCoachingRequestSchema = BasePrepareCheckoutRequestSchema.extend({
    type: z.literal('StudentCoursePurchaseWithCoaching'),
    courseSlug: z.string(),
    // Legacy support
    courseId: z.number().int().optional(),
});

// Package purchase (without coaching)
const StudentPackagePurchaseRequestSchema = BasePrepareCheckoutRequestSchema.extend({
    type: z.literal('StudentPackagePurchase'),
    packageId: z.number().int(),
    selectedCourseIds: z.array(z.number().int()).optional(), // Optional - defaults to all courses
});

// Package purchase (with coaching)
const StudentPackagePurchaseWithCoachingRequestSchema = BasePrepareCheckoutRequestSchema.extend({
    type: z.literal('StudentPackagePurchaseWithCoaching'),
    packageId: z.number().int(),
    selectedCourseIds: z.array(z.number().int()).optional(),
});

// Coaching session purchase
const StudentCoachingSessionPurchaseRequestSchema = BasePrepareCheckoutRequestSchema.extend({
    type: z.literal('StudentCoachingSessionPurchase'),
    coachingOfferingId: z.number().int(),
    quantity: z.number().int().min(1).default(1),
});

// Discriminated union
export const PrepareCheckoutRequestSchema = z.discriminatedUnion('type', [
    StudentCoursePurchaseRequestSchema,
    StudentCoursePurchaseWithCoachingRequestSchema,
    StudentPackagePurchaseRequestSchema,
    StudentPackagePurchaseWithCoachingRequestSchema,
    StudentCoachingSessionPurchaseRequestSchema,
]);

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
