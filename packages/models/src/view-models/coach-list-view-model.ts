import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';


export const CoachListSuccessSchema = ListCoachesSuccessResponseSchema.shape.data;

export type TCoachListSuccess = z.infer<typeof CoachListSuccessSchema>;

const CoachListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachListSuccessSchema)
const CoachListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const CoachListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CoachListViewModelSchemaMap = {
    default: CoachListDefaultViewModelSchema,
    kaboom: CoachListKaboomViewModelSchema,
    notFound: CoachListNotFoundViewModelSchema,
};
export type TCoachListViewModelSchemaMap = typeof CoachListViewModelSchemaMap;
export const CoachListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachListViewModelSchemaMap);
export type TCoachListViewModel = z.infer<typeof CoachListViewModelSchema>;
