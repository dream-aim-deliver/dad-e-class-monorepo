import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachingOfferingsSuccessResponseSchema } from "@dream-aim-deliver/e-class-cms-rest";

export const CoachingOfferingListSuccessSchema = ListCoachingOfferingsSuccessResponseSchema.shape.data;

export type TCoachingOfferingListSuccess = z.infer<typeof CoachingOfferingListSuccessSchema>;

const CoachingOfferingListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachingOfferingListSuccessSchema)

const CoachingOfferingListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

const CoachingOfferingListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CoachingOfferingListViewModelSchemaMap = {
    default: CoachingOfferingListDefaultViewModelSchema,
    kaboom: CoachingOfferingListKaboomViewModelSchema,
    notFound: CoachingOfferingListNotFoundViewModelSchema,
};

export type TCoachingOfferingListViewModelSchemaMap = typeof CoachingOfferingListViewModelSchemaMap;

export const CoachingOfferingListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachingOfferingListViewModelSchemaMap);

export type TCoachingOfferingListViewModel = z.infer<typeof CoachingOfferingListViewModelSchema>;
