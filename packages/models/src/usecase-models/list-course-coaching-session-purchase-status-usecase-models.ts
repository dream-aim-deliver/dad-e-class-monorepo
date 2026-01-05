import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const ListCourseCoachingSessionPurchaseStatusRequestSchema = z.object({
    courseSlug: z.string(),
});

export type TListCourseCoachingSessionPurchaseStatusRequest = z.infer<typeof ListCourseCoachingSessionPurchaseStatusRequestSchema>;

const CoachingSessionPurchaseStatusSchema = z.object({
    status: z.enum(['purchased', 'not_purchased', 'pending']),
    coachingOfferingTitle: z.string(),
    coachingOfferingDuration: z.number().int().positive(),
    coachingSessionId: z.number().int().nullable(),
    lessonComponentId: z.string(),
    lessonId: z.number().int(),
    lessonTitle: z.string(),
    moduleId: z.number().int(),
    moduleTitle: z.string(),
    purchaseDate: z.string().datetime({ offset: true }).nullable(),
});

export const ListCourseCoachingSessionPurchaseStatusSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    coachingSessions: z.array(CoachingSessionPurchaseStatusSchema),
}));

export type TListCourseCoachingSessionPurchaseStatusSuccessResponse = z.infer<typeof ListCourseCoachingSessionPurchaseStatusSuccessResponseSchema>;

const ListCourseCoachingSessionPurchaseStatusUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCourseCoachingSessionPurchaseStatusUseCaseErrorResponse = z.infer<typeof ListCourseCoachingSessionPurchaseStatusUseCaseErrorResponseSchema>;

export const ListCourseCoachingSessionPurchaseStatusUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCourseCoachingSessionPurchaseStatusSuccessResponseSchema,
    ListCourseCoachingSessionPurchaseStatusUseCaseErrorResponseSchema,
]);

export type TListCourseCoachingSessionPurchaseStatusUseCaseResponse = z.infer<typeof ListCourseCoachingSessionPurchaseStatusUseCaseResponseSchema>;

