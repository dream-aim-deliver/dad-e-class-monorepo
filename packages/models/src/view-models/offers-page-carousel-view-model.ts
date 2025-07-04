import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetOffersPageCarouselSuccessResponseSchema } from '../usecase-models';

export const OffersPageCarouselSuccessSchema = GetOffersPageCarouselSuccessResponseSchema.shape.data;

export type TOffersPageCarouselSuccess = z.infer<typeof OffersPageCarouselSuccessSchema>;

const OffersPageCarouselDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", OffersPageCarouselSuccessSchema)
const OffersPageCarouselKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())
const OffersPageCarouselUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory())

export const OffersPageCarouselViewModelSchemaMap = {
    default: OffersPageCarouselDefaultViewModelSchema,
    kaboom: OffersPageCarouselKaboomViewModelSchema,
    unauthenticated: OffersPageCarouselUnauthenticatedViewModelSchema,
};
export type TOffersPageCarouselViewModelSchemaMap = typeof OffersPageCarouselViewModelSchemaMap;
export const OffersPageCarouselViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(OffersPageCarouselViewModelSchemaMap);
export type TOffersPageCarouselViewModel = z.infer<typeof OffersPageCarouselViewModelSchema>;
