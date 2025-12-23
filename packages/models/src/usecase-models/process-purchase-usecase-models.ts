import { z } from "zod";
import {
    BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from "@dream-aim-deliver/dad-cats";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Nested Models for Request
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TransactionDataSchema = z.object({
    paymentExternalId: z.string(),
    paymentProvider: z.string(),
    amount: z.number().int(), // In cents
    currency: z.string(),
    customerEmail: z.string().email(),
    paymentStatus: z.string(),
    metadata: z.record(z.unknown()).optional().default({}),
});

const PurchaseTypeEnumSchema = z.enum([
    "StudentCoursePurchase",
    "StudentCoursePurchaseWithCoaching",
    "StudentPackagePurchase",
    "StudentPackagePurchaseWithCoaching",
    "StudentCoachingSessionPurchase",
    "StudentCourseCoachingSessionPurchase",
]);

const PurchaseItemCourseSchema = z.object({
    purchaseType: z.literal("course"),
    courseSlug: z.string(),
    withCoaching: z.boolean().optional().default(false),
});

const PurchaseItemPackageSchema = z.object({
    purchaseType: z.literal("package"),
    packageId: z.number().int(),
    selectedCourseIds: z.array(z.number().int()).optional(),
    withCoaching: z.boolean().optional().default(false),
});

const CoachingOfferingSchema = z.object({
    coachingOfferingId: z.number().int(),
    quantity: z.number().int().min(1),
});

const PurchaseItemCoachingSessionsSchema = z.object({
    purchaseType: z.literal("coaching_sessions"),
    offerings: z.array(CoachingOfferingSchema),
});

const PurchaseItemCourseCoachingSessionsSchema = z.object({
    purchaseType: z.literal("course_coaching_sessions"),
    courseSlug: z.string(),
    lessonComponentIds: z.array(z.string()), // MongoDB ObjectIds of LessonComponentDocument
});

const PurchaseItemSchema = z.discriminatedUnion("purchaseType", [
    PurchaseItemCourseSchema,
    PurchaseItemPackageSchema,
    PurchaseItemCoachingSessionsSchema,
    PurchaseItemCourseCoachingSessionsSchema,
]);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Request Schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ProcessPurchaseRequestSchema = z.object({
    userId: z.string(),
    transactionData: TransactionDataSchema,
    purchaseType: PurchaseTypeEnumSchema,
    purchaseItems: z.array(PurchaseItemSchema),
    couponCode: z.string().optional().nullable(),
});

export type TProcessPurchaseRequest = z.infer<
    typeof ProcessPurchaseRequestSchema
>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Success Response
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const EnrollmentResultSchema = z.object({
    courseId: z.number().int(),
    coachingIncluded: z.boolean(),
});

const CoachingSessionResultSchema = z.object({
    offeringId: z.number().int().nullable(),
    sessionId: z.number().int(),
    courseId: z.number().int().nullable(),
});

const ProcessPurchaseSuccessDataSchema = z.object({
    success: z.boolean().default(true),
    alreadyProcessed: z.boolean(),
    transactionId: z.string(),
    enrollments: z.array(EnrollmentResultSchema),
    coachingSessions: z.array(CoachingSessionResultSchema),
});

export const ProcessPurchaseSuccessResponseSchema = BaseSuccessSchemaFactory(
    ProcessPurchaseSuccessDataSchema,
);

export type TProcessPurchaseSuccessResponse = z.infer<
    typeof ProcessPurchaseSuccessResponseSchema
>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Error Types (Custom errors only - authentication_error is in dad-cats SDK)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PaymentNotCompletedError = BaseDiscriminatedErrorTypeSchemaFactory({
    type: "payment_not_completed",
    schema: z.object({
        stripeSessionId: z.string(),
        paymentStatus: z.string(),
    }),
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Error Response Union
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ProcessPurchaseErrorResponseSchema =
    BaseErrorDiscriminatedUnionSchemaFactory({
        payment_not_completed: PaymentNotCompletedError,
    });

export type TProcessPurchaseErrorResponse = z.infer<
    typeof ProcessPurchaseErrorResponseSchema
>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Status Response Union
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ProcessPurchaseUseCaseResponseSchema =
    BaseStatusDiscriminatedUnionSchemaFactory([
        ProcessPurchaseSuccessResponseSchema,
        ProcessPurchaseErrorResponseSchema,
    ]);

export type TProcessPurchaseUseCaseResponse = z.infer<
    typeof ProcessPurchaseUseCaseResponseSchema
>;
