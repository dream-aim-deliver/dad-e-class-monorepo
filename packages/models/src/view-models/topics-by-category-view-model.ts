import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListTopicsByCategorySuccessResponseSchema, TTopicItem } from '@dream-aim-deliver/e-class-cms-rest';

export type TMatrixTopic = TTopicItem;

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
