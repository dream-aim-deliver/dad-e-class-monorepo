import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetOffersPageOutlineSuccessResponseSchema } from '../usecase-models';

export const OffersPageOutlineSuccessSchema = GetOffersPageOutlineSuccessResponseSchema.shape.data;

export type TOffersPageOutlineSuccess = z.infer<typeof OffersPageOutlineSuccessSchema>;

const OffersPageOutlineDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", OffersPageOutlineSuccessSchema)
const OffersPageOutlineKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})))

export const OffersPageOutlineViewModelSchemaMap = {
    default: OffersPageOutlineDefaultViewModelSchema,
    kaboom: OffersPageOutlineKaboomViewModelSchema,
};
export type TOffersPageOutlineViewModelSchemaMap = typeof OffersPageOutlineViewModelSchemaMap;
export const OffersPageOutlineViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(OffersPageOutlineViewModelSchemaMap);
export type TOffersPageOutlineViewModel = z.infer<typeof OffersPageOutlineViewModelSchema>;
