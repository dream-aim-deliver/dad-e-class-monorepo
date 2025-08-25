import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const TopicListSuccessSchema = z.object({
    topics: z.array(z.object({
        name: z.string(),
        url: z.string(),
    }))
});

export type TTopicListSuccess = z.infer<typeof TopicListSuccessSchema>;

const TopicListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", TopicListSuccessSchema)
const TopicListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})))

export const TopicListViewModelSchemaMap = {
    default: TopicListDefaultViewModelSchema,
    kaboom: TopicListKaboomViewModelSchema,
};
export type TTopicListViewModelSchemaMap = typeof TopicListViewModelSchemaMap;
export const TopicListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(TopicListViewModelSchemaMap);
export type TTopicListViewModel = z.infer<typeof TopicListViewModelSchema>;
