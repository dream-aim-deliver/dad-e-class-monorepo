import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListNotificationsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListNotificationsSuccessSchema = ListNotificationsSuccessResponseSchema.shape.data;
export type TListNotificationsSuccess = z.infer<typeof ListNotificationsSuccessSchema>;

// Define view mode schemas
const ListNotificationsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListNotificationsSuccessSchema
);

const ListNotificationsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListNotificationsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListNotificationsViewModelSchemaMap = {
    default: ListNotificationsDefaultViewModelSchema,
    kaboom: ListNotificationsKaboomViewModelSchema,
    notFound: ListNotificationsNotFoundViewModelSchema,
};
export type TListNotificationsViewModelSchemaMap = typeof ListNotificationsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListNotificationsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListNotificationsViewModelSchemaMap);
export type TListNotificationsViewModel = z.infer<typeof ListNotificationsViewModelSchema>;
