import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const AddCourseCoachRequestSchema = z.object({
    coachId: z.number().min(1).int(),
    courseSlug: z.string().min(1),
});
export type TAddCourseCoachRequest = z.infer<typeof AddCourseCoachRequestSchema>;

export const AddCourseCoachSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));
export type TAddCourseCoachSuccessResponse = z.infer<typeof AddCourseCoachSuccessResponseSchema>;

const AddCourseCoachUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TAddCourseCoachUseCaseErrorResponse = z.infer<typeof AddCourseCoachUseCaseErrorResponseSchema>;

export const AddCourseCoachUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    AddCourseCoachSuccessResponseSchema,
    AddCourseCoachUseCaseErrorResponseSchema,
]);
export type TAddCourseCoachUseCaseResponse = z.infer<typeof AddCourseCoachUseCaseResponseSchema>;