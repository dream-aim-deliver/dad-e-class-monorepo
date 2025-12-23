import { z } from 'zod';
import {
    BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { PriceAdjustmentSchema } from '../entity/purchase-eligibility';

/**
 * Enumeration of possible error types for prepare checkout operation
 */
/* eslint-disable no-unused-vars */
export enum PrepareCheckoutErrorType {
    USER_ALREADY_ENROLLED = 'user_already_enrolled',
    COURSE_NOT_FOUND = 'course_not_found',
    PACKAGE_NOT_FOUND = 'package_not_found',
    COACHING_OFFERING_NOT_FOUND = 'coaching_offering_not_found',
    COUPON_NOT_FOUND = 'coupon_not_found',
    COUPON_EXPIRED = 'coupon_expired',
    COUPON_LIMIT_REACHED = 'coupon_limit_reached',
    COUPON_USER_LIMIT_REACHED = 'coupon_user_limit_reached',
    INVALID_COUPON_TYPE = 'invalid_coupon_type',
    NOT_ENROLLED_IN_COURSE = 'not_enrolled_in_course',
    COMPONENT_COACHING_ALREADY_PURCHASED = 'component_coaching_already_purchased',
    LESSON_COMPONENT_NOT_FOUND = 'lesson_component_not_found',
}
/* eslint-enable no-unused-vars */

// Purchase Type Enum
export const PurchaseTypeEnumSchema = z.enum([
    'StudentCoursePurchase',
    'StudentCoursePurchaseWithCoaching',
    'StudentPackagePurchase',
    'StudentPackagePurchaseWithCoaching',
    'StudentCoachingSessionPurchase',
    'StudentCourseCoachingSessionPurchase',
]);
export type TPurchaseTypeEnum = z.infer<typeof PurchaseTypeEnumSchema>;

// Base Request Schema
const PrepareCheckoutBaseRequestSchema = z.object({
    couponCode: z.string().optional(),
});

// Course Purchase Request (without coaching)
export const PrepareCheckoutCoursePurchaseRequestSchema = PrepareCheckoutBaseRequestSchema.extend({
    purchaseType: z.literal('StudentCoursePurchase'),
    courseSlug: z.string(),
    courseId: z.number().optional(), // Legacy support
});
export type TPrepareCheckoutCoursePurchaseRequest = z.infer<typeof PrepareCheckoutCoursePurchaseRequestSchema>;

// Course Purchase Request (with coaching)
export const PrepareCheckoutCourseWithCoachingRequestSchema = PrepareCheckoutBaseRequestSchema.extend({
    purchaseType: z.literal('StudentCoursePurchaseWithCoaching'),
    courseSlug: z.string(),
    courseId: z.number().optional(), // Legacy support
});
export type TPrepareCheckoutCourseWithCoachingRequest = z.infer<typeof PrepareCheckoutCourseWithCoachingRequestSchema>;

// Package Purchase Request (without coaching)
export const PrepareCheckoutPackagePurchaseRequestSchema = PrepareCheckoutBaseRequestSchema.extend({
    purchaseType: z.literal('StudentPackagePurchase'),
    packageId: z.number(),
    selectedCourseIds: z.array(z.number()).optional(), // Defaults to all courses
});
export type TPrepareCheckoutPackagePurchaseRequest = z.infer<typeof PrepareCheckoutPackagePurchaseRequestSchema>;

// Package Purchase Request (with coaching)
export const PrepareCheckoutPackageWithCoachingRequestSchema = PrepareCheckoutBaseRequestSchema.extend({
    purchaseType: z.literal('StudentPackagePurchaseWithCoaching'),
    packageId: z.number(),
    selectedCourseIds: z.array(z.number()).optional(),
});
export type TPrepareCheckoutPackageWithCoachingRequest = z.infer<typeof PrepareCheckoutPackageWithCoachingRequestSchema>;

// Coaching Session Purchase Request
export const PrepareCheckoutCoachingSessionRequestSchema = PrepareCheckoutBaseRequestSchema.extend({
    purchaseType: z.literal('StudentCoachingSessionPurchase'),
    coachingOfferingId: z.number(),
    quantity: z.number().default(1),
});
export type TPrepareCheckoutCoachingSessionRequest = z.infer<typeof PrepareCheckoutCoachingSessionRequestSchema>;

// Course Coaching Session Purchase Request (specific components from a course)
export const PrepareCheckoutCourseCoachingSessionRequestSchema = PrepareCheckoutBaseRequestSchema.extend({
    purchaseType: z.literal('StudentCourseCoachingSessionPurchase'),
    courseSlug: z.string(),
    lessonComponentIds: z.array(z.string()), // MongoDB ObjectIds of LessonComponentDocument
});
export type TPrepareCheckoutCourseCoachingSessionRequest = z.infer<typeof PrepareCheckoutCourseCoachingSessionRequestSchema>;

// Discriminated Union Request Schema
export const PrepareCheckoutRequestSchema = z.discriminatedUnion('purchaseType', [
    PrepareCheckoutCoursePurchaseRequestSchema,
    PrepareCheckoutCourseWithCoachingRequestSchema,
    PrepareCheckoutPackagePurchaseRequestSchema,
    PrepareCheckoutPackageWithCoachingRequestSchema,
    PrepareCheckoutCoachingSessionRequestSchema,
    PrepareCheckoutCourseCoachingSessionRequestSchema,
]);
export type TPrepareCheckoutRequest = z.infer<typeof PrepareCheckoutRequestSchema>;

// Invoice Line Item Schema
export const InvoiceLineItemSchema = z.object({
    name: z.string(),
    description: z.string(),
    unitPrice: z.number(), // In CHF
    quantity: z.number(),
    totalPrice: z.number(), // In CHF
    currency: z.string().default('CHF'),
});
export type TInvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;

// Success Response Data
const PrepareCheckoutSuccessDataSchema = z.object({
    lineItems: z.array(InvoiceLineItemSchema),
    currency: z.string().default('CHF'),
    finalPrice: z.number(), // Total price in CHF (VAT included in base prices)
    couponCode: z.string().optional(),
    priceAdjustment: PriceAdjustmentSchema.optional(), // For upgrade scenarios
});

export const PrepareCheckoutSuccessResponseSchema = BaseSuccessSchemaFactory(PrepareCheckoutSuccessDataSchema);
export type TPrepareCheckoutSuccessResponse = z.infer<typeof PrepareCheckoutSuccessResponseSchema>;

// Base error context schema for all error types
const ErrorContextSchema = z.object({
    userId: z.number().int().optional().nullable(),
    operationDetails: z.record(z.any()).optional().nullable(),
});

// Error Response Union - includes all possible error types from backend
export const PrepareCheckoutErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
    UserAlreadyEnrolled: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.USER_ALREADY_ENROLLED,
        schema: ErrorContextSchema,
    }),
    CourseNotFound: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COURSE_NOT_FOUND,
        schema: ErrorContextSchema,
    }),
    PackageNotFound: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.PACKAGE_NOT_FOUND,
        schema: ErrorContextSchema,
    }),
    CoachingOfferingNotFound: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COACHING_OFFERING_NOT_FOUND,
        schema: ErrorContextSchema,
    }),
    CouponNotFound: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COUPON_NOT_FOUND,
        schema: ErrorContextSchema,
    }),
    CouponExpired: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COUPON_EXPIRED,
        schema: ErrorContextSchema,
    }),
    CouponLimitReached: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COUPON_LIMIT_REACHED,
        schema: ErrorContextSchema,
    }),
    CouponUserLimitReached: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COUPON_USER_LIMIT_REACHED,
        schema: ErrorContextSchema,
    }),
    InvalidCouponType: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.INVALID_COUPON_TYPE,
        schema: ErrorContextSchema,
    }),
    NotEnrolledInCourse: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.NOT_ENROLLED_IN_COURSE,
        schema: ErrorContextSchema,
    }),
    ComponentCoachingAlreadyPurchased: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.COMPONENT_COACHING_ALREADY_PURCHASED,
        schema: ErrorContextSchema,
    }),
    LessonComponentNotFound: BaseDiscriminatedErrorTypeSchemaFactory({
        type: PrepareCheckoutErrorType.LESSON_COMPONENT_NOT_FOUND,
        schema: ErrorContextSchema,
    }),
});
export type TPrepareCheckoutErrorResponse = z.infer<typeof PrepareCheckoutErrorResponseSchema>;

// Status Response Union
export const PrepareCheckoutUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    PrepareCheckoutSuccessResponseSchema,
    PrepareCheckoutErrorResponseSchema,
]);
export type TPrepareCheckoutUseCaseResponse = z.infer<typeof PrepareCheckoutUseCaseResponseSchema>;
