import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachingPageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetCoachingPageSuccessSchema = GetCoachingPageSuccessResponseSchema.shape.data;

export type TCoachingPageSuccess = z.infer<typeof GetCoachingPageSuccessSchema>;

const GetCoachingPageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetCoachingPageSuccessSchema)
const GetCoachingPageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const GetCoachingPageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CoachingPageViewModelSchemaMap = {
    default: GetCoachingPageDefaultViewModelSchema,
    kaboom: GetCoachingPageKaboomViewModelSchema,
    notFound: GetCoachingPageNotFoundViewModelSchema,
};
export type TGetCoachingPageViewModelSchemaMap = typeof CoachingPageViewModelSchemaMap;
export const GetCoachingPageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachingPageViewModelSchemaMap);
export type TGetCoachingPageViewModel = z.infer<typeof GetCoachingPageViewModelSchema>;
