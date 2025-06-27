import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListTopicsRequestSchema = z.object({});
export type TListTopicsRequest = z.infer<typeof ListTopicsRequestSchema>;

const ListTopicsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    topics: z.array(z.object({
        name: z.string(),
        slug: z.string(),
    }))
}));

export type TListTopicsSuccessResponse = z.infer<typeof ListTopicsSuccessResponseSchema>;

const ListTopicsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListTopicsUseCaseErrorResponse = z.infer<typeof ListTopicsUseCaseErrorResponseSchema>;
export const ListTopicsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListTopicsSuccessResponseSchema,
    ListTopicsUseCaseErrorResponseSchema,
]);
export type TListTopicsUseCaseResponse = z.infer<typeof ListTopicsUseCaseResponseSchema>;
