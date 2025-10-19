import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPackagesShortSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListPackagesShortSuccessSchema = ListPackagesShortSuccessResponseSchema.shape.data;
export type TListPackagesShortSuccess = z.infer<typeof ListPackagesShortSuccessSchema>;

// Define view mode schemas
const ListPackagesShortDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListPackagesShortSuccessSchema
);

const ListPackagesShortKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListPackagesShortNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListPackagesShortViewModelSchemaMap = {
    default: ListPackagesShortDefaultViewModelSchema,
    kaboom: ListPackagesShortKaboomViewModelSchema,
    notFound: ListPackagesShortNotFoundViewModelSchema,
};
export type TListPackagesShortViewModelSchemaMap = typeof ListPackagesShortViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListPackagesShortViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListPackagesShortViewModelSchemaMap);
export type TListPackagesShortViewModel = z.infer<typeof ListPackagesShortViewModelSchema>;
