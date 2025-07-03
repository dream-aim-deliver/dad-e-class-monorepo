import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListAvailableCoachingsSuccessResponseSchema } from '../usecase-models/list-available-coachings-usecase-models';

export const AvailableCoachingListSuccessSchema = ListAvailableCoachingsSuccessResponseSchema.shape.data;

export type TAvailableCoachingListSuccess = z.infer<typeof AvailableCoachingListSuccessSchema>;

const AvailableCoachingListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AvailableCoachingListSuccessSchema)
const AvailableCoachingListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())
const AvailableCoachingListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory())

export const AvailableCoachingListViewModelSchemaMap = {
    default: AvailableCoachingListDefaultViewModelSchema,
    kaboom: AvailableCoachingListKaboomViewModelSchema,
    notFound: AvailableCoachingListNotFoundViewModelSchema,
};
export type TAvailableCoachingListViewModelSchemaMap = typeof AvailableCoachingListViewModelSchemaMap;
export const AvailableCoachingListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AvailableCoachingListViewModelSchemaMap);
export type TAvailableCoachingListViewModel = z.infer<typeof AvailableCoachingListViewModelSchema>;
