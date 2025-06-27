import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachingPageSuccessResponseSchema } from '../usecase-models';

export const CoachingPageSuccessSchema = GetCoachingPageSuccessResponseSchema.shape.data;

export type TCoachingPageSuccess = z.infer<typeof CoachingPageSuccessSchema>;

const CoachingPageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachingPageSuccessSchema)
const CoachingPageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())
const CoachingPageUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory())

export const CoachingPageViewModelSchemaMap = {
    default: CoachingPageDefaultViewModelSchema,
    kaboom: CoachingPageKaboomViewModelSchema,
    unauthenticated: CoachingPageUnauthenticatedViewModelSchema,
};
export type TCoachingPageViewModelSchemaMap = typeof CoachingPageViewModelSchemaMap;
export const CoachingPageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachingPageViewModelSchemaMap);
export type TCoachingPageViewModel = z.infer<typeof CoachingPageViewModelSchema>;
