import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UpdateCoachingOfferingUseCaseResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success schema from discriminated union
const UpdateCoachingOfferingSuccessResponseSchema = UpdateCoachingOfferingUseCaseResponseSchema.options[0];
export const UpdateCoachingOfferingSuccessSchema = UpdateCoachingOfferingSuccessResponseSchema.shape.data;

export type TUpdateCoachingOfferingSuccess = z.infer<typeof UpdateCoachingOfferingSuccessSchema>;

const UpdateCoachingOfferingDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", UpdateCoachingOfferingSuccessSchema);
const UpdateCoachingOfferingInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const UpdateCoachingOfferingKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const UpdateCoachingOfferingViewModelSchemaMap = {
    default: UpdateCoachingOfferingDefaultViewModelSchema,
    invalid: UpdateCoachingOfferingInvalidViewModelSchema,
    kaboom: UpdateCoachingOfferingKaboomViewModelSchema,
};
export type TUpdateCoachingOfferingViewModelSchemaMap = typeof UpdateCoachingOfferingViewModelSchemaMap;
export const UpdateCoachingOfferingViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpdateCoachingOfferingViewModelSchemaMap);
export type TUpdateCoachingOfferingViewModel = z.infer<typeof UpdateCoachingOfferingViewModelSchema>;
