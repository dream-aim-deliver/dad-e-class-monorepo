import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { NotificationSchema } from './common';

export const MarkNotificationsAsReadRequestSchema = z.object({
    notificationIds: z.array(z.number()),
});
export type TMarkNotificationsAsReadRequest = z.infer<typeof MarkNotificationsAsReadRequestSchema>;

export const MarkNotificationsAsReadSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    notifications: NotificationSchema.extend({
        id: z.number(),
    }).array(),
}));

export type TMarkNotificationsAsReadSuccessResponse = z.infer<typeof MarkNotificationsAsReadSuccessResponseSchema>;

const MarkNotificationsAsReadUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TMarkNotificationsAsReadUseCaseErrorResponse = z.infer<typeof MarkNotificationsAsReadUseCaseErrorResponseSchema>;

export const MarkNotificationsAsReadUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    MarkNotificationsAsReadSuccessResponseSchema,
    MarkNotificationsAsReadUseCaseErrorResponseSchema,
]);

export type TMarkNotificationsAsReadUseCaseResponse = z.infer<typeof MarkNotificationsAsReadUseCaseResponseSchema>;