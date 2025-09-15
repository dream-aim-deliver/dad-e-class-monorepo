import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';
import { NotificationSchema } from './common';

export const ListNotificationsRequestSchema = DefaultPaginationSchema.extend({
    userId: z.number(),
});
export type TListNotificationsRequest = z.infer<typeof ListNotificationsRequestSchema>;

export const ListNotificationsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    notifications: NotificationSchema.extend({
        id: z.number(),
    }).array(),
}));

export type TListNotificationsSuccessResponse = z.infer<typeof ListNotificationsSuccessResponseSchema>;

const ListNotificationsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListNotificationsUseCaseErrorResponse = z.infer<typeof ListNotificationsUseCaseErrorResponseSchema>;

export const ListNotificationsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListNotificationsSuccessResponseSchema,
    ListNotificationsUseCaseErrorResponseSchema,
]);

export type TListNotificationsUseCaseResponse = z.infer<typeof ListNotificationsUseCaseResponseSchema>;