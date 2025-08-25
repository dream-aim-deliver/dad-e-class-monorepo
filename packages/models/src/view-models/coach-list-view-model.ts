import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachesSuccessResponseSchema } from '../usecase-models/list-coaches-usecase-models';

export const CoachListSuccessSchema = ListCoachesSuccessResponseSchema.shape.data;

export type TCoachListSuccess = z.infer<typeof CoachListSuccessSchema>;

const CoachListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachListSuccessSchema)
const CoachListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})))
const CoachListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(z.object({}), z.object({})))

export const CoachListViewModelSchemaMap = {
    default: CoachListDefaultViewModelSchema,
    kaboom: CoachListKaboomViewModelSchema,
    notFound: CoachListNotFoundViewModelSchema,
};
export type TCoachListViewModelSchemaMap = typeof CoachListViewModelSchemaMap;
export const CoachListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachListViewModelSchemaMap);
export type TCoachListViewModel = z.infer<typeof CoachListViewModelSchema>;
