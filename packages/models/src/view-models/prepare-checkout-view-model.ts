import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { PrepareCheckoutSuccessResponseSchema } from '../usecase-models/prepare-checkout-usecase-models';

/**
 * Extract success data from usecase response
 */
export const PrepareCheckoutSuccessSchema =
    PrepareCheckoutSuccessResponseSchema.shape.data;

export type TPrepareCheckoutSuccess = z.infer<
    typeof PrepareCheckoutSuccessSchema
>;

/**
 * Define view modes for different UI states
 */
const PrepareCheckoutDefaultViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'default',
        PrepareCheckoutSuccessSchema,
    );

const PrepareCheckoutKaboomViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'kaboom',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

const PrepareCheckoutCouponNotFoundViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'coupon-not-found',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

const PrepareCheckoutCouponExpiredViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'coupon-expired',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

const PrepareCheckoutCouponLimitReachedViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'coupon-limit-reached',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

const PrepareCheckoutInvalidCouponTypeViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'invalid-coupon-type',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

/**
 * Create schema map for all view modes
 */
export const PrepareCheckoutViewModelSchemaMap = {
    default: PrepareCheckoutDefaultViewModelSchema,
    kaboom: PrepareCheckoutKaboomViewModelSchema,
    couponNotFound: PrepareCheckoutCouponNotFoundViewModelSchema,
    couponExpired: PrepareCheckoutCouponExpiredViewModelSchema,
    couponLimitReached: PrepareCheckoutCouponLimitReachedViewModelSchema,
    invalidCouponType: PrepareCheckoutInvalidCouponTypeViewModelSchema,
};

export type TPrepareCheckoutViewModelSchemaMap =
    typeof PrepareCheckoutViewModelSchemaMap;

/**
 * Create discriminated union of all view modes
 */
export const PrepareCheckoutViewModelSchema =
    BaseViewModelDiscriminatedUnionSchemaFactory(
        PrepareCheckoutViewModelSchemaMap,
    );

export type TPrepareCheckoutViewModel = z.infer<
    typeof PrepareCheckoutViewModelSchema
>;
