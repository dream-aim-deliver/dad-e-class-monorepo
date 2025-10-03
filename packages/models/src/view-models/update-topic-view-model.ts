import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UpdateTopicSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const UpdateTopicSuccessSchema = UpdateTopicSuccessResponseSchema.shape.data;

export type TUpdateTopicSuccess = z.infer<typeof UpdateTopicSuccessSchema>;

const UpdateTopicDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", UpdateTopicSuccessSchema);
const UpdateTopicInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const UpdateTopicKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const UpdateTopicViewModelSchemaMap = {
    default: UpdateTopicDefaultViewModelSchema,
    invalid: UpdateTopicInvalidViewModelSchema,
    kaboom: UpdateTopicKaboomViewModelSchema,
};
export type TUpdateTopicViewModelSchemaMap = typeof UpdateTopicViewModelSchemaMap;
export const UpdateTopicViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpdateTopicViewModelSchemaMap);
export type TUpdateTopicViewModel = z.infer<typeof UpdateTopicViewModelSchema>;
