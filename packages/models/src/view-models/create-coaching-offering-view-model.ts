import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCoachingOfferingUseCaseResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success schema from discriminated union
const CreateCoachingOfferingSuccessResponseSchema = CreateCoachingOfferingUseCaseResponseSchema.options[0];
export const CreateCoachingOfferingSuccessSchema = CreateCoachingOfferingSuccessResponseSchema.shape.data;

export type TCreateCoachingOfferingSuccess = z.infer<typeof CreateCoachingOfferingSuccessSchema>;

const CreateCoachingOfferingDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateCoachingOfferingSuccessSchema);
const CreateCoachingOfferingInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CreateCoachingOfferingKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateCoachingOfferingViewModelSchemaMap = {
    default: CreateCoachingOfferingDefaultViewModelSchema,
    invalid: CreateCoachingOfferingInvalidViewModelSchema,
    kaboom: CreateCoachingOfferingKaboomViewModelSchema,
};
export type TCreateCoachingOfferingViewModelSchemaMap = typeof CreateCoachingOfferingViewModelSchemaMap;
export const CreateCoachingOfferingViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCoachingOfferingViewModelSchemaMap);
export type TCreateCoachingOfferingViewModel = z.infer<typeof CreateCoachingOfferingViewModelSchema>;
