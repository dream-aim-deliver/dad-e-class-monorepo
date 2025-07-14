import { z } from 'zod';
import {
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetCoachingPageRequestSchema = z.object({});
export type TGetCoachingPageRequest = z.infer<typeof GetCoachingPageRequestSchema>;

export const GetCoachingPageSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    title: z.string(),
    description: z.string(),
    banner: z.object({
        title: z.string(),
        description: z.string(),
        imageUrl: z.string().nullable(),
        buttonText: z.string(),
        buttonLink: z.string(),
    })
}));

export type TGetCoachingPageSuccessResponse = z.infer<typeof GetCoachingPageSuccessResponseSchema>;

const GetCoachingPageUseCaseErrorResponseSchema = BaseErrorSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema);
export type TGetCoachingPageUseCaseErrorResponse = z.infer<typeof GetCoachingPageUseCaseErrorResponseSchema>;
export const GetCoachingPageUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetCoachingPageSuccessResponseSchema,
    GetCoachingPageUseCaseErrorResponseSchema,
]);
export type TGetCoachingPageUseCaseResponse = z.infer<typeof GetCoachingPageUseCaseResponseSchema>;
