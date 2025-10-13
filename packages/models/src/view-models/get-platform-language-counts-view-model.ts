import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPlatformLanguageCountsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPlatformLanguageCountsSuccessSchema = GetPlatformLanguageCountsSuccessResponseSchema.shape.data;
export type TGetPlatformLanguageCountsSuccess = z.infer<typeof GetPlatformLanguageCountsSuccessSchema>;

// Define view mode schemas
const GetPlatformLanguageCountsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPlatformLanguageCountsSuccessSchema
);

const GetPlatformLanguageCountsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPlatformLanguageCountsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPlatformLanguageCountsViewModelSchemaMap = {
    default: GetPlatformLanguageCountsDefaultViewModelSchema,
    kaboom: GetPlatformLanguageCountsKaboomViewModelSchema,
    notFound: GetPlatformLanguageCountsNotFoundViewModelSchema,
};
export type TGetPlatformLanguageCountsViewModelSchemaMap = typeof GetPlatformLanguageCountsViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPlatformLanguageCountsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPlatformLanguageCountsViewModelSchemaMap);
export type TGetPlatformLanguageCountsViewModel = z.infer<typeof GetPlatformLanguageCountsViewModelSchema>;
