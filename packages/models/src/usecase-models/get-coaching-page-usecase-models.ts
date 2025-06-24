import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
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
        buttonText: z.string(),
        buttonLink: z.string(),
    })
}));

export type TGetCoachingPageSuccessResponse = z.infer<typeof GetCoachingPageSuccessResponseSchema>;

const GetCoachingPageUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCoachingPageUseCaseErrorResponse = z.infer<typeof GetCoachingPageUseCaseErrorResponseSchema>;
export const GetCoachingPageUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetCoachingPageSuccessResponseSchema,
    GetCoachingPageUseCaseErrorResponseSchema,
]);
export type TGetCoachingPageUseCaseResponse = z.infer<typeof GetCoachingPageUseCaseResponseSchema>;
