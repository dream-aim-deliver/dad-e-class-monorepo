import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const LanguageListSuccessSchema = z.object({
    languages: z.array(z.object({
        languageCode: z.string(),
        language: z.string(),
    }))
});

export type TLanguageListSuccess = z.infer<typeof LanguageListSuccessSchema>;

const LanguageListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", LanguageListSuccessSchema)
const LanguageListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})))

export const LanguageListViewModelSchemaMap = {
    default: LanguageListDefaultViewModelSchema,
    kaboom: LanguageListKaboomViewModelSchema,
};
export type TLanguageListViewModelSchemaMap = typeof LanguageListViewModelSchemaMap;
export const LanguageListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(LanguageListViewModelSchemaMap);
export type TLanguageListViewModel = z.infer<typeof LanguageListViewModelSchema>;
