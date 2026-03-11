import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetFeedbackSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const FeedbackSuccessSchema = GetFeedbackSuccessResponseSchema.shape.data;

export type TFeedbackSuccess = z.infer<typeof FeedbackSuccessSchema>;

const FeedbackDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", FeedbackSuccessSchema);
const FeedbackKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const FeedbackViewModelSchemaMap = {
    default: FeedbackDefaultViewModelSchema,
    kaboom: FeedbackKaboomViewModelSchema,
};
export type TFeedbackViewModelSchemaMap = typeof FeedbackViewModelSchemaMap;
export const FeedbackViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(FeedbackViewModelSchemaMap);
export type TFeedbackViewModel = z.infer<typeof FeedbackViewModelSchema>;
