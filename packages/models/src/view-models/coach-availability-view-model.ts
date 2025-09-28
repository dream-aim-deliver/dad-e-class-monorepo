import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachAvailabilitySuccessResponseSchema } from '../usecase-models/get-coach-availability-usecase-models';

export const CoachAvailabilitySuccessSchema = GetCoachAvailabilitySuccessResponseSchema.shape.data;

export type TCoachAvailabilitySuccess = z.infer<typeof CoachAvailabilitySuccessSchema>;

const CoachAvailabilityDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachAvailabilitySuccessSchema);
const CoachAvailabilityUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory());
const CoachAvailabilityKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());

export const CoachAvailabilityViewModelSchemaMap = {
    default: CoachAvailabilityDefaultViewModelSchema,
    kaboom: CoachAvailabilityKaboomViewModelSchema,
    unauthenticated: CoachAvailabilityUnauthenticatedViewModelSchema,
};
export type TCoachAvailabilityViewModelSchemaMap = typeof CoachAvailabilityViewModelSchemaMap;
export const CoachAvailabilityViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachAvailabilityViewModelSchemaMap);
export type TCoachAvailabilityViewModel = z.infer<typeof CoachAvailabilityViewModelSchema>;
