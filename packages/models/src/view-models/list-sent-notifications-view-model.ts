import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListSentNotificationsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListSentNotificationsSuccessSchema = ListSentNotificationsSuccessResponseSchema.shape.data;
export type TListSentNotificationsSuccess = z.infer<typeof ListSentNotificationsSuccessSchema>;

// Define view mode schemas
const ListSentNotificationsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListSentNotificationsSuccessSchema
);

const ListSentNotificationsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListSentNotificationsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListSentNotificationsViewModelSchemaMap = {
    default: ListSentNotificationsDefaultViewModelSchema,
    kaboom: ListSentNotificationsKaboomViewModelSchema,
    notFound: ListSentNotificationsNotFoundViewModelSchema,
};
export type TListSentNotificationsViewModelSchemaMap = typeof ListSentNotificationsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListSentNotificationsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListSentNotificationsViewModelSchemaMap);
export type TListSentNotificationsViewModel = z.infer<typeof ListSentNotificationsViewModelSchema>;
