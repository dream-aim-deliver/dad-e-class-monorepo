import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListOffersPagePackagesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListOffersPagePackagesSuccessSchema = ListOffersPagePackagesSuccessResponseSchema.shape.data;
export type TListOffersPagePackagesSuccess = z.infer<typeof ListOffersPagePackagesSuccessSchema>;

// Define view mode schemas
const ListOffersPagePackagesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListOffersPagePackagesSuccessSchema
);

const ListOffersPagePackagesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListOffersPagePackagesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListOffersPagePackagesViewModelSchemaMap = {
    default: ListOffersPagePackagesDefaultViewModelSchema,
    kaboom: ListOffersPagePackagesKaboomViewModelSchema,
    notFound: ListOffersPagePackagesNotFoundViewModelSchema,
};
export type TListOffersPagePackagesViewModelSchemaMap = typeof ListOffersPagePackagesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListOffersPagePackagesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListOffersPagePackagesViewModelSchemaMap);
export type TListOffersPagePackagesViewModel = z.infer<typeof ListOffersPagePackagesViewModelSchema>;
