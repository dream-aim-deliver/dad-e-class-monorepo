import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetHomePageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetHomePageSuccessSchema = GetHomePageSuccessResponseSchema.shape.data;
export type TGetHomePageSuccess = z.infer<typeof GetHomePageSuccessSchema>;

// Define view mode schemas
const GetHomePageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetHomePageSuccessSchema
);

const GetHomePageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetHomePageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetHomePageViewModelSchemaMap = {
    default: GetHomePageDefaultViewModelSchema,
    kaboom: GetHomePageKaboomViewModelSchema,
    notFound: GetHomePageNotFoundViewModelSchema,
};
export type TGetHomePageViewModelSchemaMap = typeof GetHomePageViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetHomePageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetHomePageViewModelSchemaMap);
export type TGetHomePageViewModel = z.infer<typeof GetHomePageViewModelSchema>;
