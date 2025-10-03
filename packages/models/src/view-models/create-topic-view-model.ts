import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateTopicUseCaseResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success schema from discriminated union
const CreateTopicSuccessResponseSchema = CreateTopicUseCaseResponseSchema.options[0];
export const CreateTopicSuccessSchema = CreateTopicSuccessResponseSchema.shape.data;

export type TCreateTopicSuccess = z.infer<typeof CreateTopicSuccessSchema>;

const CreateTopicDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateTopicSuccessSchema);
const CreateTopicInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CreateTopicKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateTopicViewModelSchemaMap = {
    default: CreateTopicDefaultViewModelSchema,
    invalid: CreateTopicInvalidViewModelSchema,
    kaboom: CreateTopicKaboomViewModelSchema,
};
export type TCreateTopicViewModelSchemaMap = typeof CreateTopicViewModelSchemaMap;
export const CreateTopicViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateTopicViewModelSchemaMap);
export type TCreateTopicViewModel = z.infer<typeof CreateTopicViewModelSchema>;
