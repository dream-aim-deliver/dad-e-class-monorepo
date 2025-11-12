import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateNotificationSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreateNotificationSuccessSchema = CreateNotificationSuccessResponseSchema.shape.data;
export type TCreateNotificationSuccess = z.infer<typeof CreateNotificationSuccessSchema>;

// Define view mode schemas
const CreateNotificationDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreateNotificationSuccessSchema
);

const CreateNotificationKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreateNotificationNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreateNotificationViewModelSchemaMap = {
    default: CreateNotificationDefaultViewModelSchema,
    kaboom: CreateNotificationKaboomViewModelSchema,
    notFound: CreateNotificationNotFoundViewModelSchema,
};
export type TCreateNotificationViewModelSchemaMap = typeof CreateNotificationViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreateNotificationViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateNotificationViewModelSchemaMap);
export type TCreateNotificationViewModel = z.infer<typeof CreateNotificationViewModelSchema>;
