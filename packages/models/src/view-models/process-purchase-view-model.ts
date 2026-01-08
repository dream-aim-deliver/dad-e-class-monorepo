import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ProcessPurchaseSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

/**
 * Extract success data from usecase response
 */
export const ProcessPurchaseSuccessSchema =
    ProcessPurchaseSuccessResponseSchema.shape.data;

export type TProcessPurchaseSuccess = z.infer<
    typeof ProcessPurchaseSuccessSchema
>;

/**
 * Define view modes for different UI states
 */
const ProcessPurchaseDefaultViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'default',
        ProcessPurchaseSuccessSchema,
    );

const ProcessPurchaseKaboomViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'kaboom',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

const ProcessPurchasePaymentNotCompletedViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'payment-not-completed',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

/**
 * Create schema map for all view modes
 */
export const ProcessPurchaseViewModelSchemaMap = {
    default: ProcessPurchaseDefaultViewModelSchema,
    kaboom: ProcessPurchaseKaboomViewModelSchema,
    paymentNotCompleted: ProcessPurchasePaymentNotCompletedViewModelSchema,
};

export type TProcessPurchaseViewModelSchemaMap =
    typeof ProcessPurchaseViewModelSchemaMap;

/**
 * Create discriminated union of all view modes
 */
export const ProcessPurchaseViewModelSchema =
    BaseViewModelDiscriminatedUnionSchemaFactory(
        ProcessPurchaseViewModelSchemaMap,
    );

export type TProcessPurchaseViewModel = z.infer<
    typeof ProcessPurchaseViewModelSchema
>;

