import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateNotificationSuccessResponseSchema } from '../usecase-models/create-notification-usecase-models';

export const CreateNotificationSuccessSchema = CreateNotificationSuccessResponseSchema.shape.data;

export type TCreateNotificationSuccess = z.infer<typeof CreateNotificationSuccessSchema>;

const CreateNotificationDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateNotificationSuccessSchema);
const CreateNotificationKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateNotificationViewModelSchemaMap = {
    default: CreateNotificationDefaultViewModelSchema,
    kaboom: CreateNotificationKaboomViewModelSchema,
};
export type TCreateNotificationViewModelSchemaMap = typeof CreateNotificationViewModelSchemaMap;
export const CreateNotificationViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateNotificationViewModelSchemaMap);
export type TCreateNotificationViewModel = z.infer<typeof CreateNotificationViewModelSchema>;
