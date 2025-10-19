import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCouponSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreateCouponSuccessSchema = CreateCouponSuccessResponseSchema.shape.data;
export type TCreateCouponSuccess = z.infer<typeof CreateCouponSuccessSchema>;

// Define view mode schemas
const CreateCouponDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreateCouponSuccessSchema
);

const CreateCouponKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreateCouponNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreateCouponViewModelSchemaMap = {
    default: CreateCouponDefaultViewModelSchema,
    kaboom: CreateCouponKaboomViewModelSchema,
    notFound: CreateCouponNotFoundViewModelSchema,
};
export type TCreateCouponViewModelSchemaMap = typeof CreateCouponViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreateCouponViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCouponViewModelSchemaMap);
export type TCreateCouponViewModel = z.infer<typeof CreateCouponViewModelSchema>;
