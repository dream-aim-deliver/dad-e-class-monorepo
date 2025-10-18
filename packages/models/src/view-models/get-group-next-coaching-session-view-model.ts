import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetGroupNextCoachingSessionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetGroupNextCoachingSessionSuccessSchema = GetGroupNextCoachingSessionSuccessResponseSchema.shape.data;
export type TGetGroupNextCoachingSessionSuccess = z.infer<typeof GetGroupNextCoachingSessionSuccessSchema>;

// Define view mode schemas
const GetGroupNextCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetGroupNextCoachingSessionSuccessSchema
);

const GetGroupNextCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetGroupNextCoachingSessionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetGroupNextCoachingSessionViewModelSchemaMap = {
    default: GetGroupNextCoachingSessionDefaultViewModelSchema,
    kaboom: GetGroupNextCoachingSessionKaboomViewModelSchema,
    notFound: GetGroupNextCoachingSessionNotFoundViewModelSchema,
};
export type TGetGroupNextCoachingSessionViewModelSchemaMap = typeof GetGroupNextCoachingSessionViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetGroupNextCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetGroupNextCoachingSessionViewModelSchemaMap);
export type TGetGroupNextCoachingSessionViewModel = z.infer<typeof GetGroupNextCoachingSessionViewModelSchema>;
