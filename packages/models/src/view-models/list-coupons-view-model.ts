import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCouponsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCouponsSuccessSchema = ListCouponsSuccessResponseSchema.shape.data;
export type TListCouponsSuccess = z.infer<typeof ListCouponsSuccessSchema>;

// Define view mode schemas
const ListCouponsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCouponsSuccessSchema
);

const ListCouponsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCouponsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCouponsViewModelSchemaMap = {
    default: ListCouponsDefaultViewModelSchema,
    kaboom: ListCouponsKaboomViewModelSchema,
    notFound: ListCouponsNotFoundViewModelSchema,
};
export type TListCouponsViewModelSchemaMap = typeof ListCouponsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCouponsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCouponsViewModelSchemaMap);
export type TListCouponsViewModel = z.infer<typeof ListCouponsViewModelSchema>;
