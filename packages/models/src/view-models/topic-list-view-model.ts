import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const TopicListSuccessSchema = z.object({
    topics: z.union([
        z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                url: z.string(),
                slug: z.string(),
            })
        ),
        z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                url: z.string(),
                slug: z.string(),
                courseCount: z.number(),
                coachCount: z.number(),
            })
        )
    ])
});

export type TTopicListSuccess = z.infer<typeof TopicListSuccessSchema>;

const TopicListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", TopicListSuccessSchema)
const TopicListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const TopicListViewModelSchemaMap = {
    default: TopicListDefaultViewModelSchema,
    kaboom: TopicListKaboomViewModelSchema,
};
export type TTopicListViewModelSchemaMap = typeof TopicListViewModelSchemaMap;
export const TopicListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(TopicListViewModelSchemaMap);
export type TTopicListViewModel = z.infer<typeof TopicListViewModelSchema>;
