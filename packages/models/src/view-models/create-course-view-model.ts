import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCourseSuccessResponseSchema } from '../usecase-models/create-course-usecase-models';

export const CreateCourseSuccessSchema = CreateCourseSuccessResponseSchema.shape.data;

export type TCreateCourseSuccess = z.infer<typeof CreateCourseSuccessSchema>;

const CreateCourseDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateCourseSuccessSchema);
const CreateCourseInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CreateCourseKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateCourseViewModelSchemaMap = {
    default: CreateCourseDefaultViewModelSchema,
    invalid: CreateCourseInvalidViewModelSchema,
    kaboom: CreateCourseKaboomViewModelSchema,
};
export type TCreateCourseViewModelSchemaMap = typeof CreateCourseViewModelSchemaMap;
export const CreateCourseViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCourseViewModelSchemaMap);
export type TCreateCourseViewModel = z.infer<typeof CreateCourseViewModelSchema>;
