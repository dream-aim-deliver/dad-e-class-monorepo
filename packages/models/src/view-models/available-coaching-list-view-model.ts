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
const AvailableCoachingListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})))
const AvailableCoachingListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(z.object({}), z.object({})))
const AvailableCoachingListUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const AvailableCoachingListViewModelSchemaMap = {
    default: AvailableCoachingListDefaultViewModelSchema,
    kaboom: AvailableCoachingListKaboomViewModelSchema,
    notFound: AvailableCoachingListNotFoundViewModelSchema,
    unauthenticated: AvailableCoachingListUnauthenticatedViewModelSchema,
};
export type TAvailableCoachingListViewModelSchemaMap = typeof AvailableCoachingListViewModelSchemaMap;
export const AvailableCoachingListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AvailableCoachingListViewModelSchemaMap);
export type TAvailableCoachingListViewModel = z.infer<typeof AvailableCoachingListViewModelSchema>;
