import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListTopicsByCategoryRequestSchema = DefaultPaginationSchema.extend({});
export type TListTopicsByCategoryRequest = z.infer<typeof ListTopicsByCategoryRequestSchema>;

const TopicItemSchema = z.object({
    name: z.string(),
    slug: z.string(),
});

export const ListTopicsByCategorySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    // Relationship between category name and its topics
    categories: z.object({
        name: z.string(),
        topics: z.array(TopicItemSchema),
    }).array(),
}));

export type TListTopicsByCategorySuccessResponse = z.infer<typeof ListTopicsByCategorySuccessResponseSchema>;

const ListTopicsByCategoryUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListTopicsByCategoryUseCaseErrorResponse = z.infer<typeof ListTopicsByCategoryUseCaseErrorResponseSchema>;
export const ListTopicsByCategoryUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListTopicsByCategorySuccessResponseSchema,
    ListTopicsByCategoryUseCaseErrorResponseSchema,
]);
export type TListTopicsByCategoryUseCaseResponse = z.infer<typeof ListTopicsByCategoryUseCaseResponseSchema>;
