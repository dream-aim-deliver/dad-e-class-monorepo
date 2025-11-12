import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateGroupCoachingSessionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreateGroupCoachingSessionSuccessSchema = CreateGroupCoachingSessionSuccessResponseSchema.shape.data;
export type TCreateGroupCoachingSessionSuccess = z.infer<typeof CreateGroupCoachingSessionSuccessSchema>;

// Define view mode schemas
const CreateGroupCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreateGroupCoachingSessionSuccessSchema
);

const CreateGroupCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreateGroupCoachingSessionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreateGroupCoachingSessionViewModelSchemaMap = {
    default: CreateGroupCoachingSessionDefaultViewModelSchema,
    kaboom: CreateGroupCoachingSessionKaboomViewModelSchema,
    notFound: CreateGroupCoachingSessionNotFoundViewModelSchema,
};
export type TCreateGroupCoachingSessionViewModelSchemaMap = typeof CreateGroupCoachingSessionViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreateGroupCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateGroupCoachingSessionViewModelSchemaMap);
export type TCreateGroupCoachingSessionViewModel = z.infer<typeof CreateGroupCoachingSessionViewModelSchema>;
