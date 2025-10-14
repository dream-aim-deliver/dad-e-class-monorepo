import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ArchivePackageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ArchivePackageSuccessSchema = ArchivePackageSuccessResponseSchema.shape.data;
export type TArchivePackageSuccess = z.infer<typeof ArchivePackageSuccessSchema>;

// Define view mode schemas
const ArchivePackageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ArchivePackageSuccessSchema
);

const ArchivePackageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ArchivePackageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ArchivePackageViewModelSchemaMap = {
    default: ArchivePackageDefaultViewModelSchema,
    kaboom: ArchivePackageKaboomViewModelSchema,
    notFound: ArchivePackageNotFoundViewModelSchema,
};
export type TArchivePackageViewModelSchemaMap = typeof ArchivePackageViewModelSchemaMap;

// Create discriminated union of all view modes
export const ArchivePackageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ArchivePackageViewModelSchemaMap);
export type TArchivePackageViewModel = z.infer<typeof ArchivePackageViewModelSchema>;
