import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListGroupCoachingSessionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListGroupCoachingSessionsSuccessSchema = ListGroupCoachingSessionsSuccessResponseSchema.shape.data;
export type TListGroupCoachingSessionsSuccess = z.infer<typeof ListGroupCoachingSessionsSuccessSchema>;

// Define view mode schemas
const ListGroupCoachingSessionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListGroupCoachingSessionsSuccessSchema
);

const ListGroupCoachingSessionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListGroupCoachingSessionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListGroupCoachingSessionsViewModelSchemaMap = {
    default: ListGroupCoachingSessionsDefaultViewModelSchema,
    kaboom: ListGroupCoachingSessionsKaboomViewModelSchema,
    notFound: ListGroupCoachingSessionsNotFoundViewModelSchema,
};
export type TListGroupCoachingSessionsViewModelSchemaMap = typeof ListGroupCoachingSessionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListGroupCoachingSessionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListGroupCoachingSessionsViewModelSchemaMap);
export type TListGroupCoachingSessionsViewModel = z.infer<typeof ListGroupCoachingSessionsViewModelSchema>;
