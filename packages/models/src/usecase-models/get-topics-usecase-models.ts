import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetTopicsRequestSchema = z.object({});
export type TGetTopicsRequest = z.infer<typeof GetTopicsRequestSchema>;

const GetTopicsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    topics: z.array(z.object({
        id: z.string().or(z.number()),
        name: z.string(),
        slug: z.string(),
    }))
}));

export type TGetTopicsSuccessResponse = z.infer<typeof GetTopicsSuccessResponseSchema>;

const GetTopicsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetTopicsUseCaseErrorResponse = z.infer<typeof GetTopicsUseCaseErrorResponseSchema>;
export const GetTopicsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetTopicsSuccessResponseSchema,
    GetTopicsUseCaseErrorResponseSchema,
]);
export type TGetTopicsUseCaseResponse = z.infer<typeof GetTopicsUseCaseResponseSchema>;
