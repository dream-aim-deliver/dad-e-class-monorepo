import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import {
    GetPlatformSuccessResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';

export const GetPlatformSuccessSchema = GetPlatformSuccessResponseSchema.shape.data;
export type TGetPlatformSuccess = z.infer<typeof GetPlatformSuccessSchema>;


const PlatformDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetPlatformSuccessSchema)
const PlatformKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const PlatformViewModelSchemaMap = {
    default: PlatformDefaultViewModelSchema,
    kaboom: PlatformKaboomViewModelSchema,
};
export type TPlatformViewModelSchemaMap = typeof PlatformViewModelSchemaMap;
export const PlatformViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PlatformViewModelSchemaMap);
export type TPlatformViewModel = z.infer<typeof PlatformViewModelSchema>;
