import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListTopicsByCategorySuccessResponseSchema } from '../usecase-models';

const TopicSchema = z.object({
    name: z.string(),
    slug: z.string(),
});

export type TMatrixTopic = z.infer<typeof TopicSchema>;

export const TopicsByCategorySuccessSchema = ListTopicsByCategorySuccessResponseSchema.shape.data;

export type TTopicsByCategorySuccess = z.infer<typeof TopicsByCategorySuccessSchema>;

const TopicsByCategoryDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", TopicsByCategorySuccessSchema)
const TopicsByCategoryKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const TopicsByCategoryViewModelSchemaMap = {
    default: TopicsByCategoryDefaultViewModelSchema,
    kaboom: TopicsByCategoryKaboomViewModelSchema,
};
export type TTopicsByCategoryViewModelSchemaMap = typeof TopicsByCategoryViewModelSchemaMap;
export const TopicsByCategoryViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(TopicsByCategoryViewModelSchemaMap);
export type TTopicsByCategoryViewModel = z.infer<typeof TopicsByCategoryViewModelSchema>;
