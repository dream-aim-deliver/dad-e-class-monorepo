import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachingPageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const CoachingPageSuccessSchema = GetCoachingPageSuccessResponseSchema.shape.data;

export type TCoachingPageSuccess = z.infer<typeof CoachingPageSuccessSchema>;

const CoachingPageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachingPageSuccessSchema)
const CoachingPageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const CoachingPageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CoachingPageViewModelSchemaMap = {
    default: CoachingPageDefaultViewModelSchema,
    kaboom: CoachingPageKaboomViewModelSchema,
    notFound: CoachingPageNotFoundViewModelSchema,
};
export type TCoachingPageViewModelSchemaMap = typeof CoachingPageViewModelSchemaMap;
export const CoachingPageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachingPageViewModelSchemaMap);
export type TCoachingPageViewModel = z.infer<typeof CoachingPageViewModelSchema>;
