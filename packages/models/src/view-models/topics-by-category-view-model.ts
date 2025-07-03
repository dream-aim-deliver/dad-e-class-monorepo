import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

const TopicSchema = z.object({
    name: z.string(),
    slug: z.string(),
});

export type TMatrixTopic = z.infer<typeof TopicSchema>;

export const TopicsByCategorySuccessSchema = z.object({
    topicsByCategory: z.record(z.string(), z.object({
        name: z.string(),
        slug: z.string(),
    }).array())
});

export type TTopicsByCategorySuccess = z.infer<typeof TopicsByCategorySuccessSchema>;

const TopicsByCategoryDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", TopicsByCategorySuccessSchema)
const TopicsByCategoryKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())

export const TopicsByCategoryViewModelSchemaMap = {
    default: TopicsByCategoryDefaultViewModelSchema,
    kaboom: TopicsByCategoryKaboomViewModelSchema,
};
export type TTopicsByCategoryViewModelSchemaMap = typeof TopicsByCategoryViewModelSchemaMap;
export const TopicsByCategoryViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(TopicsByCategoryViewModelSchemaMap);
export type TTopicsByCategoryViewModel = z.infer<typeof TopicsByCategoryViewModelSchema>;
