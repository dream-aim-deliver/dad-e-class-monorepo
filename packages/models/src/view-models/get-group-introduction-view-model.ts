import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetGroupIntroductionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetGroupIntroductionSuccessSchema = GetGroupIntroductionSuccessResponseSchema.shape.data;
export type TGetGroupIntroductionSuccess = z.infer<typeof GetGroupIntroductionSuccessSchema>;

// Define view mode schemas
const GetGroupIntroductionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetGroupIntroductionSuccessSchema
);

const GetGroupIntroductionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetGroupIntroductionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetGroupIntroductionViewModelSchemaMap = {
    default: GetGroupIntroductionDefaultViewModelSchema,
    kaboom: GetGroupIntroductionKaboomViewModelSchema,
    notFound: GetGroupIntroductionNotFoundViewModelSchema,
};
export type TGetGroupIntroductionViewModelSchemaMap = typeof GetGroupIntroductionViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetGroupIntroductionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetGroupIntroductionViewModelSchemaMap);
export type TGetGroupIntroductionViewModel = z.infer<typeof GetGroupIntroductionViewModelSchema>;
