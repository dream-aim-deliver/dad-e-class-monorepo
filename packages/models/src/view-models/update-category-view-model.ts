import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UpdateCategorySuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const UpdateCategorySuccessSchema = UpdateCategorySuccessResponseSchema.shape.data;

export type TUpdateCategorySuccess = z.infer<typeof UpdateCategorySuccessSchema>;

const UpdateCategoryDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", UpdateCategorySuccessSchema);
const UpdateCategoryInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const UpdateCategoryKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const UpdateCategoryViewModelSchemaMap = {
    default: UpdateCategoryDefaultViewModelSchema,
    invalid: UpdateCategoryInvalidViewModelSchema,
    kaboom: UpdateCategoryKaboomViewModelSchema,
};
export type TUpdateCategoryViewModelSchemaMap = typeof UpdateCategoryViewModelSchemaMap;
export const UpdateCategoryViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpdateCategoryViewModelSchemaMap);
export type TUpdateCategoryViewModel = z.infer<typeof UpdateCategoryViewModelSchema>;
