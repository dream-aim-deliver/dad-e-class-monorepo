import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCategorySuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const CreateCategorySuccessSchema = CreateCategorySuccessResponseSchema.shape.data;

export type TCreateCategorySuccess = z.infer<typeof CreateCategorySuccessSchema>;

const CreateCategoryDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateCategorySuccessSchema);
const CreateCategoryInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CreateCategoryKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateCategoryViewModelSchemaMap = {
    default: CreateCategoryDefaultViewModelSchema,
    invalid: CreateCategoryInvalidViewModelSchema,
    kaboom: CreateCategoryKaboomViewModelSchema,
};
export type TCreateCategoryViewModelSchemaMap = typeof CreateCategoryViewModelSchemaMap;
export const CreateCategoryViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCategoryViewModelSchemaMap);
export type TCreateCategoryViewModel = z.infer<typeof CreateCategoryViewModelSchema>;
