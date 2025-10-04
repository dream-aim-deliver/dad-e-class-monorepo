import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { RequestCoachingSessionSuccessResponseSchema } from '../usecase-models/request-coaching-session-usecase-models';

export const RequestCoachingSessionSuccessSchema = RequestCoachingSessionSuccessResponseSchema.shape.data;

export type TRequestCoachingSessionSuccess = z.infer<typeof RequestCoachingSessionSuccessSchema>;

const RequestCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", RequestCoachingSessionSuccessSchema);
const RequestCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const RequestCoachingSessionViewModelSchemaMap = {
    default: RequestCoachingSessionDefaultViewModelSchema,
    kaboom: RequestCoachingSessionKaboomViewModelSchema,
};
export type TRequestCoachingSessionViewModelSchemaMap = typeof RequestCoachingSessionViewModelSchemaMap;
export const RequestCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RequestCoachingSessionViewModelSchemaMap);
export type TRequestCoachingSessionViewModel = z.infer<typeof RequestCoachingSessionViewModelSchema>;
