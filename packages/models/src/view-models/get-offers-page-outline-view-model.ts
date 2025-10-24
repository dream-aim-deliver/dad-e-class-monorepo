import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetOffersPageOutlineSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetOffersPageOutlineSuccessSchema = GetOffersPageOutlineSuccessResponseSchema.shape.data;

export type TGetOffersPageOutlineSuccess = z.infer<typeof GetOffersPageOutlineSuccessSchema>;

const OffersPageOutlineDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetOffersPageOutlineSuccessSchema)
const OffersPageOutlineKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const OffersPageOutlineNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const GetOffersPageOutlineViewModelSchemaMap = {
    default: OffersPageOutlineDefaultViewModelSchema,
    kaboom: OffersPageOutlineKaboomViewModelSchema,
    notFound: OffersPageOutlineNotFoundViewModelSchema
};
export type TGetOffersPageOutlineViewModelSchemaMap = typeof GetOffersPageOutlineViewModelSchemaMap;
export const GetOffersPageOutlineViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetOffersPageOutlineViewModelSchemaMap);
export type TGetOffersPageOutlineViewModel = z.infer<typeof GetOffersPageOutlineViewModelSchema>;
