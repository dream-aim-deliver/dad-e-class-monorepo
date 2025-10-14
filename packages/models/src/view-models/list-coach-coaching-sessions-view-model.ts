import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachCoachingSessionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCoachCoachingSessionsSuccessSchema = ListCoachCoachingSessionsSuccessResponseSchema.shape.data;
export type TListCoachCoachingSessionsSuccess = z.infer<typeof ListCoachCoachingSessionsSuccessSchema>;

// Define view mode schemas
const ListCoachCoachingSessionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCoachCoachingSessionsSuccessSchema
);

const ListCoachCoachingSessionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCoachCoachingSessionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCoachCoachingSessionsViewModelSchemaMap = {
    default: ListCoachCoachingSessionsDefaultViewModelSchema,
    kaboom: ListCoachCoachingSessionsKaboomViewModelSchema,
    notFound: ListCoachCoachingSessionsNotFoundViewModelSchema,
};
export type TListCoachCoachingSessionsViewModelSchemaMap = typeof ListCoachCoachingSessionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCoachCoachingSessionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachCoachingSessionsViewModelSchemaMap);
export type TListCoachCoachingSessionsViewModel = z.infer<typeof ListCoachCoachingSessionsViewModelSchema>;
