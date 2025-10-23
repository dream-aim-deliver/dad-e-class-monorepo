import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { PublishPackageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const PublishPackageSuccessSchema = PublishPackageSuccessResponseSchema.shape.data;
export type TPublishPackageSuccess = z.infer<typeof PublishPackageSuccessSchema>;

// Define view mode schemas
const PublishPackageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    PublishPackageSuccessSchema
);

const PublishPackageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const PublishPackageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const PublishPackageViewModelSchemaMap = {
    default: PublishPackageDefaultViewModelSchema,
    kaboom: PublishPackageKaboomViewModelSchema,
    notFound: PublishPackageNotFoundViewModelSchema,
};
export type TPublishPackageViewModelSchemaMap = typeof PublishPackageViewModelSchemaMap;

// Create discriminated union of all view modes
export const PublishPackageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PublishPackageViewModelSchemaMap);
export type TPublishPackageViewModel = z.infer<typeof PublishPackageViewModelSchema>;
