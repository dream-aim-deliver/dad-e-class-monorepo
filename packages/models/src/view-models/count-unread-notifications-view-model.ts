import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CountUnreadNotificationsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CountUnreadNotificationsSuccessSchema = CountUnreadNotificationsSuccessResponseSchema.shape.data;
export type TCountUnreadNotificationsSuccess = z.infer<typeof CountUnreadNotificationsSuccessSchema>;

// Define view mode schemas
const CountUnreadNotificationsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CountUnreadNotificationsSuccessSchema
);

const CountUnreadNotificationsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CountUnreadNotificationsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CountUnreadNotificationsViewModelSchemaMap = {
    default: CountUnreadNotificationsDefaultViewModelSchema,
    kaboom: CountUnreadNotificationsKaboomViewModelSchema,
    notFound: CountUnreadNotificationsNotFoundViewModelSchema,
};
export type TCountUnreadNotificationsViewModelSchemaMap = typeof CountUnreadNotificationsViewModelSchemaMap;

// Create discriminated union of all view modes
export const CountUnreadNotificationsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CountUnreadNotificationsViewModelSchemaMap);
export type TCountUnreadNotificationsViewModel = z.infer<typeof CountUnreadNotificationsViewModelSchema>;
