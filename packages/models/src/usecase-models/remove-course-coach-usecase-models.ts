import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const RemoveCourseCoachRequestSchema = z.object({
    coachId: z.number(),
    courseSlug: z.string(),
});
export type TRemoveCourseCoachRequest = z.infer<typeof RemoveCourseCoachRequestSchema>;

export const RemoveCourseCoachSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));
export type TRemoveCourseCoachSuccessResponse = z.infer<typeof RemoveCourseCoachSuccessResponseSchema>;

const RemoveCourseCoachUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TRemoveCourseCoachUseCaseErrorResponse = z.infer<typeof RemoveCourseCoachUseCaseErrorResponseSchema>;

export const RemoveCourseCoachUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    RemoveCourseCoachSuccessResponseSchema,
    RemoveCourseCoachUseCaseErrorResponseSchema,
]);
export type TRemoveCourseCoachUseCaseResponse = z.infer<typeof RemoveCourseCoachUseCaseResponseSchema>;