import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { MarkNotificationsAsReadSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const MarkNotificationsAsReadSuccessSchema = MarkNotificationsAsReadSuccessResponseSchema.shape.data;
export type TMarkNotificationsAsReadSuccess = z.infer<typeof MarkNotificationsAsReadSuccessSchema>;

// Define view mode schemas
const MarkNotificationsAsReadDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    MarkNotificationsAsReadSuccessSchema
);

const MarkNotificationsAsReadKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const MarkNotificationsAsReadNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const MarkNotificationsAsReadViewModelSchemaMap = {
    default: MarkNotificationsAsReadDefaultViewModelSchema,
    kaboom: MarkNotificationsAsReadKaboomViewModelSchema,
    notFound: MarkNotificationsAsReadNotFoundViewModelSchema,
};
export type TMarkNotificationsAsReadViewModelSchemaMap = typeof MarkNotificationsAsReadViewModelSchemaMap;

// Create discriminated union of all view modes
export const MarkNotificationsAsReadViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(MarkNotificationsAsReadViewModelSchemaMap);
export type TMarkNotificationsAsReadViewModel = z.infer<typeof MarkNotificationsAsReadViewModelSchema>;
