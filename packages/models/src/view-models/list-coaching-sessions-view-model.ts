import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachingSessionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCoachingSessionsSuccessSchema = ListCoachingSessionsSuccessResponseSchema.shape.data;
export type TListCoachingSessionsSuccess = z.infer<typeof ListCoachingSessionsSuccessSchema>;

// Define view mode schemas
const ListCoachingSessionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCoachingSessionsSuccessSchema
);

const ListCoachingSessionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCoachingSessionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCoachingSessionsViewModelSchemaMap = {
    default: ListCoachingSessionsDefaultViewModelSchema,
    kaboom: ListCoachingSessionsKaboomViewModelSchema,
    notFound: ListCoachingSessionsNotFoundViewModelSchema,
};
export type TListCoachingSessionsViewModelSchemaMap = typeof ListCoachingSessionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCoachingSessionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachingSessionsViewModelSchemaMap);
export type TListCoachingSessionsViewModel = z.infer<typeof ListCoachingSessionsViewModelSchema>;
