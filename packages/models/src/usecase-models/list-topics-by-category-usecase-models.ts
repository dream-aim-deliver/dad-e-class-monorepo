import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListTopicsByCategoryRequestSchema = z.object({});
export type TListTopicsByCategoryRequest = z.infer<typeof ListTopicsByCategoryRequestSchema>;

const ListTopicsByCategorySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    // Relationship between category name and its topics
    topicsByCategory: z.record(z.string(), z.object({
        name: z.string(),
        slug: z.string(),
    }).array())
}));

export type TListTopicsByCategorySuccessResponse = z.infer<typeof ListTopicsByCategorySuccessResponseSchema>;

const ListTopicsByCategoryUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListTopicsByCategoryUseCaseErrorResponse = z.infer<typeof ListTopicsByCategoryUseCaseErrorResponseSchema>;
export const ListTopicsByCategoryUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListTopicsByCategorySuccessResponseSchema,
    ListTopicsByCategoryUseCaseErrorResponseSchema,
]);
export type TListTopicsByCategoryUseCaseResponse = z.infer<typeof ListTopicsByCategoryUseCaseResponseSchema>;
