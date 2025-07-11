import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListIncludedCoachingSessionsSuccessResponseSchema } from '../usecase-models/list-included-coaching-sessions-usecase-models';

export const IncludedCoachingSessionListSuccessSchema = ListIncludedCoachingSessionsSuccessResponseSchema.shape.data;

export type TIncludedCoachingSessionListSuccess = z.infer<typeof IncludedCoachingSessionListSuccessSchema>;

const IncludedCoachingSessionListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", IncludedCoachingSessionListSuccessSchema);
const IncludedCoachingSessionListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());

export const IncludedCoachingSessionListViewModelSchemaMap = {
    default: IncludedCoachingSessionListDefaultViewModelSchema,
    kaboom: IncludedCoachingSessionListKaboomViewModelSchema,
};
export type TIncludedCoachingSessionListViewModelSchemaMap = typeof IncludedCoachingSessionListViewModelSchemaMap;
export const IncludedCoachingSessionListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(IncludedCoachingSessionListViewModelSchemaMap);
export type TIncludedCoachingSessionListViewModel = z.infer<typeof IncludedCoachingSessionListViewModelSchema>;
