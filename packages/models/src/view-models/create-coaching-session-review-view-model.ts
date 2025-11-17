import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCoachingSessionReviewSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const CreateCoachingSessionReviewSuccessSchema = CreateCoachingSessionReviewSuccessResponseSchema.shape.data;

export type TCreateCoachingSessionReviewSuccess = z.infer<typeof CreateCoachingSessionReviewSuccessSchema>;

const CreateCoachingSessionReviewDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateCoachingSessionReviewSuccessSchema);
const CreateCoachingSessionReviewKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateCoachingSessionReviewViewModelSchemaMap = {
    default: CreateCoachingSessionReviewDefaultViewModelSchema,
    kaboom: CreateCoachingSessionReviewKaboomViewModelSchema,
};
export type TCreateCoachingSessionReviewViewModelSchemaMap = typeof CreateCoachingSessionReviewViewModelSchemaMap;
export const CreateCoachingSessionReviewViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCoachingSessionReviewViewModelSchemaMap);
export type TCreateCoachingSessionReviewViewModel = z.infer<typeof CreateCoachingSessionReviewViewModelSchema>;