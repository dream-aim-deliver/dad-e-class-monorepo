import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListNotificationsSuccessResponseSchema } from '../usecase-models/list-notifications-usecase-models';

export const NotificationsSuccessSchema = ListNotificationsSuccessResponseSchema.shape.data;

export type TNotificationsSuccess = z.infer<typeof NotificationsSuccessSchema>;

const NotificationsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", NotificationsSuccessSchema);
const NotificationsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const NotificationsViewModelSchemaMap = {
    default: NotificationsDefaultViewModelSchema,
    kaboom: NotificationsKaboomViewModelSchema,
};
export type TNotificationsViewModelSchemaMap = typeof NotificationsViewModelSchemaMap;
export const NotificationsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(NotificationsViewModelSchemaMap);
export type TNotificationsViewModel = z.infer<typeof NotificationsViewModelSchema>;