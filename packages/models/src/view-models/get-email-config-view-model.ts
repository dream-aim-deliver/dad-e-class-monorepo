import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetEmailConfigSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetEmailConfigSuccessSchema = GetEmailConfigSuccessResponseSchema.shape.data;
export type TGetEmailConfigSuccess = z.infer<typeof GetEmailConfigSuccessSchema>;

// Define view mode schemas
const GetEmailConfigDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetEmailConfigSuccessSchema
);

const GetEmailConfigKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetEmailConfigNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetEmailConfigViewModelSchemaMap = {
    default: GetEmailConfigDefaultViewModelSchema,
    kaboom: GetEmailConfigKaboomViewModelSchema,
    notFound: GetEmailConfigNotFoundViewModelSchema,
};
export type TGetEmailConfigViewModelSchemaMap = typeof GetEmailConfigViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetEmailConfigViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetEmailConfigViewModelSchemaMap);
export type TGetEmailConfigViewModel = z.infer<typeof GetEmailConfigViewModelSchema>;
