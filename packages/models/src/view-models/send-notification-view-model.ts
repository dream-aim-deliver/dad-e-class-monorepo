import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SendNotificationSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SendNotificationSuccessSchema = SendNotificationSuccessResponseSchema.shape.data;
export type TSendNotificationSuccess = z.infer<typeof SendNotificationSuccessSchema>;

// Define view mode schemas
const SendNotificationDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SendNotificationSuccessSchema
);

const SendNotificationKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SendNotificationNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SendNotificationViewModelSchemaMap = {
    default: SendNotificationDefaultViewModelSchema,
    kaboom: SendNotificationKaboomViewModelSchema,
    notFound: SendNotificationNotFoundViewModelSchema,
};
export type TSendNotificationViewModelSchemaMap = typeof SendNotificationViewModelSchemaMap;

// Create discriminated union of all view modes
export const SendNotificationViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SendNotificationViewModelSchemaMap);
export type TSendNotificationViewModel = z.infer<typeof SendNotificationViewModelSchema>;
