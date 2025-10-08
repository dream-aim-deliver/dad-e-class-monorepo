import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListLanguagesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract just the data portion from the success response schema
export const LanguageListSuccessSchema = ListLanguagesSuccessResponseSchema.shape.data;

export type TLanguageListSuccess = z.infer<typeof LanguageListSuccessSchema>;

const LanguageListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", LanguageListSuccessSchema)
const LanguageListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const LanguageListViewModelSchemaMap = {
    default: LanguageListDefaultViewModelSchema,
    kaboom: LanguageListKaboomViewModelSchema,
};
export type TLanguageListViewModelSchemaMap = typeof LanguageListViewModelSchemaMap;
export const LanguageListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(LanguageListViewModelSchemaMap);
export type TLanguageListViewModel = z.infer<typeof LanguageListViewModelSchema>;
