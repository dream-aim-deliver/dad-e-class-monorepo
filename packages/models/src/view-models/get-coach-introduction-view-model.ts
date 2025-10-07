import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachIntroductionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetCoachIntroductionSuccessSchema = GetCoachIntroductionSuccessResponseSchema.shape.data;
export type TGetCoachIntroductionSuccess = z.infer<typeof GetCoachIntroductionSuccessSchema>;

// Define view mode schemas
const GetCoachIntroductionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetCoachIntroductionSuccessSchema
);

const GetCoachIntroductionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetCoachIntroductionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetCoachIntroductionViewModelSchemaMap = {
    default: GetCoachIntroductionDefaultViewModelSchema,
    kaboom: GetCoachIntroductionKaboomViewModelSchema,
    notFound: GetCoachIntroductionNotFoundViewModelSchema,
};
export type TGetCoachIntroductionViewModelSchemaMap = typeof GetCoachIntroductionViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetCoachIntroductionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCoachIntroductionViewModelSchemaMap);
export type TGetCoachIntroductionViewModel = z.infer<typeof GetCoachIntroductionViewModelSchema>;
