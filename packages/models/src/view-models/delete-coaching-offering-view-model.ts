import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DeleteCoachingOfferingSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const DeleteCoachingOfferingSuccessSchema = DeleteCoachingOfferingSuccessResponseSchema.shape.data;

export type TDeleteCoachingOfferingSuccess = z.infer<typeof DeleteCoachingOfferingSuccessSchema>;

const DeleteCoachingOfferingDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", DeleteCoachingOfferingSuccessSchema);
const DeleteCoachingOfferingInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const DeleteCoachingOfferingKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const DeleteCoachingOfferingViewModelSchemaMap = {
    default: DeleteCoachingOfferingDefaultViewModelSchema,
    invalid: DeleteCoachingOfferingInvalidViewModelSchema,
    kaboom: DeleteCoachingOfferingKaboomViewModelSchema,
};
export type TDeleteCoachingOfferingViewModelSchemaMap = typeof DeleteCoachingOfferingViewModelSchemaMap;
export const DeleteCoachingOfferingViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DeleteCoachingOfferingViewModelSchemaMap);
export type TDeleteCoachingOfferingViewModel = z.infer<typeof DeleteCoachingOfferingViewModelSchema>;
