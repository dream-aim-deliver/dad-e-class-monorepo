import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetAssignmentSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const AssignmentSuccessSchema = GetAssignmentSuccessResponseSchema.shape.data;

export type TAssignmentSuccess = z.infer<typeof AssignmentSuccessSchema>;

const AssignmentDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssignmentSuccessSchema);
const AssignmentKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const AssignmentViewModelSchemaMap = {
    default: AssignmentDefaultViewModelSchema,
    kaboom: AssignmentKaboomViewModelSchema,
};
export type TAssignmentViewModelSchemaMap = typeof AssignmentViewModelSchemaMap;
export const AssignmentViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssignmentViewModelSchemaMap);
export type TAssignmentViewModel = z.infer<typeof AssignmentViewModelSchema>;
