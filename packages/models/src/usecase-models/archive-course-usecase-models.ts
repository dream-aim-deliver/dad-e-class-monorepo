import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ArchiveCourseRequestSchema = z.object({
    courseSlug: z.string().min(1),
});
export type TArchiveCourseRequest = z.infer<typeof ArchiveCourseRequestSchema>;

export const ArchiveCourseSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));
export type TArchiveCourseSuccessResponse = z.infer<typeof ArchiveCourseSuccessResponseSchema>;

const ArchiveCourseUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TArchiveCourseUseCaseErrorResponse = z.infer<typeof ArchiveCourseUseCaseErrorResponseSchema>;

export const ArchiveCourseUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ArchiveCourseSuccessResponseSchema,
    ArchiveCourseUseCaseErrorResponseSchema,
]);
export type TArchiveCourseUseCaseResponse = z.infer<typeof ArchiveCourseUseCaseResponseSchema>;