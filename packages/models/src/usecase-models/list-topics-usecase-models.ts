import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListTopicsRequestSchema = DefaultPaginationSchema.extend({});
export type TListTopicsRequest = z.infer<typeof ListTopicsRequestSchema>;

const ListTopicsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    topics: z.array(z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        courseCount: z.number().optional().nullable(),
        coachCount: z.number().optional().nullable(),
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
