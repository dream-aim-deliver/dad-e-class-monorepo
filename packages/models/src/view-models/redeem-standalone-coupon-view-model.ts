import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { RedeemStandaloneCouponSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const RedeemStandaloneCouponSuccessSchema = RedeemStandaloneCouponSuccessResponseSchema.shape.data;
export type TRedeemStandaloneCouponSuccess = z.infer<typeof RedeemStandaloneCouponSuccessSchema>;

// Define view mode schemas
const RedeemStandaloneCouponDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    RedeemStandaloneCouponSuccessSchema
);

const RedeemStandaloneCouponKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const RedeemStandaloneCouponNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const RedeemStandaloneCouponViewModelSchemaMap = {
    default: RedeemStandaloneCouponDefaultViewModelSchema,
    kaboom: RedeemStandaloneCouponKaboomViewModelSchema,
    notFound: RedeemStandaloneCouponNotFoundViewModelSchema,
};
export type TRedeemStandaloneCouponViewModelSchemaMap = typeof RedeemStandaloneCouponViewModelSchemaMap;

// Create discriminated union of all view modes
export const RedeemStandaloneCouponViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RedeemStandaloneCouponViewModelSchemaMap);
export type TRedeemStandaloneCouponViewModel = z.infer<typeof RedeemStandaloneCouponViewModelSchema>;
