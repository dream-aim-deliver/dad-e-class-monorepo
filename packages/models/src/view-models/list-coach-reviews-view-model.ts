import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachReviewsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCoachReviewsSuccessSchema = ListCoachReviewsSuccessResponseSchema.shape.data;
export type TListCoachReviewsSuccess = z.infer<typeof ListCoachReviewsSuccessSchema>;

// Define view mode schemas
const ListCoachReviewsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCoachReviewsSuccessSchema
);

const ListCoachReviewsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCoachReviewsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCoachReviewsViewModelSchemaMap = {
    default: ListCoachReviewsDefaultViewModelSchema,
    kaboom: ListCoachReviewsKaboomViewModelSchema,
    notFound: ListCoachReviewsNotFoundViewModelSchema,
};
export type TListCoachReviewsViewModelSchemaMap = typeof ListCoachReviewsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCoachReviewsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachReviewsViewModelSchemaMap);
export type TListCoachReviewsViewModel = z.infer<typeof ListCoachReviewsViewModelSchema>;
