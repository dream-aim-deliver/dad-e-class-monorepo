import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachCoachingSessionsSuccessResponseSchema } from '../usecase-models/list-coach-coaching-sessions-usecase-models';

export const CoachCoachingSessionsSuccessSchema = ListCoachCoachingSessionsSuccessResponseSchema.shape.data;

export type TCoachCoachingSessionsSuccess = z.infer<typeof CoachCoachingSessionsSuccessSchema>;

const CoachCoachingSessionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachCoachingSessionsSuccessSchema);
const CoachCoachingSessionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CoachCoachingSessionsViewModelSchemaMap = {
    default: CoachCoachingSessionsDefaultViewModelSchema,
    kaboom: CoachCoachingSessionsKaboomViewModelSchema,
};
export type TCoachCoachingSessionsViewModelSchemaMap = typeof CoachCoachingSessionsViewModelSchemaMap;
export const CoachCoachingSessionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachCoachingSessionsViewModelSchemaMap);
export type TCoachCoachingSessionsViewModel = z.infer<typeof CoachCoachingSessionsViewModelSchema>;