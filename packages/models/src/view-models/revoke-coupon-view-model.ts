import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { RevokeCouponSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const RevokeCouponSuccessSchema = RevokeCouponSuccessResponseSchema.shape.data;
export type TRevokeCouponSuccess = z.infer<typeof RevokeCouponSuccessSchema>;

// Define view mode schemas
const RevokeCouponDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    RevokeCouponSuccessSchema
);

const RevokeCouponKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const RevokeCouponNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const RevokeCouponViewModelSchemaMap = {
    default: RevokeCouponDefaultViewModelSchema,
    kaboom: RevokeCouponKaboomViewModelSchema,
    notFound: RevokeCouponNotFoundViewModelSchema,
};
export type TRevokeCouponViewModelSchemaMap = typeof RevokeCouponViewModelSchemaMap;

// Create discriminated union of all view modes
export const RevokeCouponViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RevokeCouponViewModelSchemaMap);
export type TRevokeCouponViewModel = z.infer<typeof RevokeCouponViewModelSchema>;
