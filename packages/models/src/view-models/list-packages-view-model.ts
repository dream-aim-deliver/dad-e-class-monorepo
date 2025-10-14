import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPackagesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListPackagesSuccessSchema = ListPackagesSuccessResponseSchema.shape.data;
export type TListPackagesSuccess = z.infer<typeof ListPackagesSuccessSchema>;

// Define view mode schemas
const ListPackagesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListPackagesSuccessSchema
);

const ListPackagesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListPackagesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListPackagesViewModelSchemaMap = {
    default: ListPackagesDefaultViewModelSchema,
    kaboom: ListPackagesKaboomViewModelSchema,
    notFound: ListPackagesNotFoundViewModelSchema,
};
export type TListPackagesViewModelSchemaMap = typeof ListPackagesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListPackagesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListPackagesViewModelSchemaMap);
export type TListPackagesViewModel = z.infer<typeof ListPackagesViewModelSchema>;
