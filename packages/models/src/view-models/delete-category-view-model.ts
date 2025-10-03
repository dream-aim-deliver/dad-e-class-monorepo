import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DeleteCategorySuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const DeleteCategorySuccessSchema = DeleteCategorySuccessResponseSchema.shape.data;

export type TDeleteCategorySuccess = z.infer<typeof DeleteCategorySuccessSchema>;

const DeleteCategoryDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", DeleteCategorySuccessSchema);
const DeleteCategoryInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const DeleteCategoryKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const DeleteCategoryViewModelSchemaMap = {
    default: DeleteCategoryDefaultViewModelSchema,
    invalid: DeleteCategoryInvalidViewModelSchema,
    kaboom: DeleteCategoryKaboomViewModelSchema,
};
export type TDeleteCategoryViewModelSchemaMap = typeof DeleteCategoryViewModelSchemaMap;
export const DeleteCategoryViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DeleteCategoryViewModelSchemaMap);
export type TDeleteCategoryViewModel = z.infer<typeof DeleteCategoryViewModelSchema>;
