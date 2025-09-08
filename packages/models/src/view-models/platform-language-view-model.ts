import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPlatformLanguageSuccessResponseSchema } from '../usecase-models/get-platform-language-usecase-models';

export const PlatformLanguageSuccessSchema = GetPlatformLanguageSuccessResponseSchema.shape.data;

export type TPlatformLanguageSuccess = z.infer<typeof PlatformLanguageSuccessSchema>;

const PlatformLanguageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", PlatformLanguageSuccessSchema);
const PlatformLanguageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const PlatformLanguageViewModelSchemaMap = {
    default: PlatformLanguageDefaultViewModelSchema,
    kaboom: PlatformLanguageKaboomViewModelSchema,
};
export type TPlatformLanguageViewModelSchemaMap = typeof PlatformLanguageViewModelSchemaMap;
export const PlatformLanguageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PlatformLanguageViewModelSchemaMap);
export type TPlatformLanguageViewModel = z.infer<typeof PlatformLanguageViewModelSchema>;
