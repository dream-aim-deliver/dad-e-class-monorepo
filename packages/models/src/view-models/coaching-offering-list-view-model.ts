import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachingOfferingsSuccessResponseSchema } from '../usecase-models/list-coaching-offerings-usecase-models';

export const CoachingOfferingListSuccessSchema = ListCoachingOfferingsSuccessResponseSchema.shape.data;

export type TCoachingOfferingListSuccess = z.infer<typeof CoachingOfferingListSuccessSchema>;

const CoachingOfferingListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachingOfferingListSuccessSchema)
const CoachingOfferingListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())
const CoachingOfferingListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory())

export const CoachingOfferingListViewModelSchemaMap = {
    default: CoachingOfferingListDefaultViewModelSchema,
    kaboom: CoachingOfferingListKaboomViewModelSchema,
    notFound: CoachingOfferingListNotFoundViewModelSchema,
};
export type TCoachingOfferingListViewModelSchemaMap = typeof CoachingOfferingListViewModelSchemaMap;
export const CoachingOfferingListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachingOfferingListViewModelSchemaMap);
export type TCoachingOfferingListViewModel = z.infer<typeof CoachingOfferingListViewModelSchema>;
