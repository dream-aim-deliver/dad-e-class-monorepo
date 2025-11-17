import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachAvailabilitySuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const CoachAvailabilitySuccessSchema = GetCoachAvailabilitySuccessResponseSchema.shape.data;

export type TCoachAvailabilitySuccess = z.infer<typeof CoachAvailabilitySuccessSchema>;

const CoachAvailabilityDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachAvailabilitySuccessSchema);
const CoachAvailabilityUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CoachAvailabilityKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CoachAvailabilityViewModelSchemaMap = {
    default: CoachAvailabilityDefaultViewModelSchema,
    kaboom: CoachAvailabilityKaboomViewModelSchema,
    unauthenticated: CoachAvailabilityUnauthenticatedViewModelSchema,
};
export type TCoachAvailabilityViewModelSchemaMap = typeof CoachAvailabilityViewModelSchemaMap;
export const CoachAvailabilityViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachAvailabilityViewModelSchemaMap);
export type TCoachAvailabilityViewModel = z.infer<typeof CoachAvailabilityViewModelSchema>;
