import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPackageRelatedPackagesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListPackageRelatedPackagesSuccessSchema = ListPackageRelatedPackagesSuccessResponseSchema.shape.data;
export type TListPackageRelatedPackagesSuccess = z.infer<typeof ListPackageRelatedPackagesSuccessSchema>;

// Define view mode schemas
const ListPackageRelatedPackagesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListPackageRelatedPackagesSuccessSchema
);

const ListPackageRelatedPackagesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListPackageRelatedPackagesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListPackageRelatedPackagesViewModelSchemaMap = {
    default: ListPackageRelatedPackagesDefaultViewModelSchema,
    kaboom: ListPackageRelatedPackagesKaboomViewModelSchema,
    notFound: ListPackageRelatedPackagesNotFoundViewModelSchema,
};
export type TListPackageRelatedPackagesViewModelSchemaMap = typeof ListPackageRelatedPackagesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListPackageRelatedPackagesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListPackageRelatedPackagesViewModelSchemaMap);
export type TListPackageRelatedPackagesViewModel = z.infer<typeof ListPackageRelatedPackagesViewModelSchema>;
