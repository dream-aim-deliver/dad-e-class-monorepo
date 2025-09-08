import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const CategoryListSuccessSchema = z.object({
    categories: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
});

export type TCategoryListSuccess = z.infer<typeof CategoryListSuccessSchema>;

const CategoryListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CategoryListSuccessSchema)
const CategoryListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CategoryListViewModelSchemaMap = {
    default: CategoryListDefaultViewModelSchema,
    kaboom: CategoryListKaboomViewModelSchema,
};
export type TCategoryListViewModelSchemaMap = typeof CategoryListViewModelSchemaMap;
export const CategoryListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CategoryListViewModelSchemaMap);
export type TCategoryListViewModel = z.infer<typeof CategoryListViewModelSchema>;
