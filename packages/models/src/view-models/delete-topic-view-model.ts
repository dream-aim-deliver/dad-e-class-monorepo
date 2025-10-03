import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DeleteTopicSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const DeleteTopicSuccessSchema = DeleteTopicSuccessResponseSchema.shape.data;

export type TDeleteTopicSuccess = z.infer<typeof DeleteTopicSuccessSchema>;

const DeleteTopicDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", DeleteTopicSuccessSchema);
const DeleteTopicInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const DeleteTopicKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const DeleteTopicViewModelSchemaMap = {
    default: DeleteTopicDefaultViewModelSchema,
    invalid: DeleteTopicInvalidViewModelSchema,
    kaboom: DeleteTopicKaboomViewModelSchema,
};
export type TDeleteTopicViewModelSchemaMap = typeof DeleteTopicViewModelSchemaMap;
export const DeleteTopicViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DeleteTopicViewModelSchemaMap);
export type TDeleteTopicViewModel = z.infer<typeof DeleteTopicViewModelSchema>;
