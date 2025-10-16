import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListGroupCoachingSessionReviewsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListGroupCoachingSessionReviewsSuccessSchema = ListGroupCoachingSessionReviewsSuccessResponseSchema.shape.data;
export type TListGroupCoachingSessionReviewsSuccess = z.infer<typeof ListGroupCoachingSessionReviewsSuccessSchema>;

// Define view mode schemas
const ListGroupCoachingSessionReviewsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListGroupCoachingSessionReviewsSuccessSchema
);

const ListGroupCoachingSessionReviewsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListGroupCoachingSessionReviewsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListGroupCoachingSessionReviewsViewModelSchemaMap = {
    default: ListGroupCoachingSessionReviewsDefaultViewModelSchema,
    kaboom: ListGroupCoachingSessionReviewsKaboomViewModelSchema,
    notFound: ListGroupCoachingSessionReviewsNotFoundViewModelSchema,
};
export type TListGroupCoachingSessionReviewsViewModelSchemaMap = typeof ListGroupCoachingSessionReviewsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListGroupCoachingSessionReviewsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListGroupCoachingSessionReviewsViewModelSchemaMap);
export type TListGroupCoachingSessionReviewsViewModel = z.infer<typeof ListGroupCoachingSessionReviewsViewModelSchema>;
