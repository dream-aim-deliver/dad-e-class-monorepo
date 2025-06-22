import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetTopicsByCategoryRequestSchema = z.object({});
export type TGetTopicsByCategoryRequest = z.infer<typeof GetTopicsByCategoryRequestSchema>;

const GetTopicsByCategorySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    // Relationship between category name and its topics
    topicsByCategory: z.record(z.string(), z.object({
        name: z.string(),
        slug: z.string(),
    }).array())
}));

export type TGetTopicsByCategorySuccessResponse = z.infer<typeof GetTopicsByCategorySuccessResponseSchema>;

const GetTopicsByCategoryUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetTopicsByCategoryUseCaseErrorResponse = z.infer<typeof GetTopicsByCategoryUseCaseErrorResponseSchema>;
export const GetTopicsByCategoryUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetTopicsByCategorySuccessResponseSchema,
    GetTopicsByCategoryUseCaseErrorResponseSchema,
]);
export type TGetTopicsByCategoryUseCaseResponse = z.infer<typeof GetTopicsByCategoryUseCaseResponseSchema>;
