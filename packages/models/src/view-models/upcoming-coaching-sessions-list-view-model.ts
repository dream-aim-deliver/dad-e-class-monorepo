import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUpcomingStudentCoachingSessionsSuccessResponseSchema } from '../usecase-models/list-upcoming-student-coaching-sessions-usecase-models';

export const UpcomingCoachingSessionsListSuccessSchema = ListUpcomingStudentCoachingSessionsSuccessResponseSchema.shape.data;

export type TUpcomingCoachingSessionsListSuccess = z.infer<typeof UpcomingCoachingSessionsListSuccessSchema>;

const UpcomingCoachingSessionsListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", UpcomingCoachingSessionsListSuccessSchema);
const UpcomingCoachingSessionsListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const UpcomingCoachingSessionsListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const UpcomingCoachingSessionsListViewModelSchemaMap = {
    default: UpcomingCoachingSessionsListDefaultViewModelSchema,
    kaboom: UpcomingCoachingSessionsListKaboomViewModelSchema,
    notFound: UpcomingCoachingSessionsListNotFoundViewModelSchema,
};
export type TUpcomingCoachingSessionsListViewModelSchemaMap = typeof UpcomingCoachingSessionsListViewModelSchemaMap;
export const UpcomingCoachingSessionsListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpcomingCoachingSessionsListViewModelSchemaMap);
export type TUpcomingCoachingSessionsListViewModel = z.infer<typeof UpcomingCoachingSessionsListViewModelSchema>;