import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListOffersPagePackagesShortSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListOffersPagePackagesShortSuccessSchema = ListOffersPagePackagesShortSuccessResponseSchema.shape.data;
export type TListOffersPagePackagesShortSuccess = z.infer<typeof ListOffersPagePackagesShortSuccessSchema>;

// Define view mode schemas
const ListOffersPagePackagesShortDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListOffersPagePackagesShortSuccessSchema
);

const ListOffersPagePackagesShortKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListOffersPagePackagesShortNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListOffersPagePackagesShortViewModelSchemaMap = {
    default: ListOffersPagePackagesShortDefaultViewModelSchema,
    kaboom: ListOffersPagePackagesShortKaboomViewModelSchema,
    notFound: ListOffersPagePackagesShortNotFoundViewModelSchema,
};
export type TListOffersPagePackagesShortViewModelSchemaMap = typeof ListOffersPagePackagesShortViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListOffersPagePackagesShortViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListOffersPagePackagesShortViewModelSchemaMap);
export type TListOffersPagePackagesShortViewModel = z.infer<typeof ListOffersPagePackagesShortViewModelSchema>;
