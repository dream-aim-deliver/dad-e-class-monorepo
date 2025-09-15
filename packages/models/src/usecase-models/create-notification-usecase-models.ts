import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { NotificationSchema } from './common';

export const CreateNotificationRequestSchema = z.object({
    message: z.string(),
    actionTitle: z.string().optional().nullable(),
    actionUrl: z.string().optional().nullable(),
    senderId: z.number(),
    receiverId: z.number(),
});
export type TCreateNotificationRequest = z.infer<typeof CreateNotificationRequestSchema>;

export const CreatedNotificationSchema = NotificationSchema.extend({
    id: z.number(),
});
export type TCreatedNotification = z.infer<typeof CreatedNotificationSchema>;

export const CreateNotificationSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    notification: CreatedNotificationSchema,
}));

export type TCreateNotificationSuccessResponse = z.infer<typeof CreateNotificationSuccessResponseSchema>;

const CreateNotificationUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TCreateNotificationUseCaseErrorResponse = z.infer<typeof CreateNotificationUseCaseErrorResponseSchema>;

export const CreateNotificationUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    CreateNotificationSuccessResponseSchema,
    CreateNotificationUseCaseErrorResponseSchema,
]);

export type TCreateNotificationUseCaseResponse = z.infer<typeof CreateNotificationUseCaseResponseSchema>;