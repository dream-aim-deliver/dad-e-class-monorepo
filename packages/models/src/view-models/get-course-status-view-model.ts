import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseStatusSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetCourseStatusSuccessSchema = GetCourseStatusSuccessResponseSchema.shape.data;

export type TGetCourseStatusSuccess = z.infer<typeof GetCourseStatusSuccessSchema>;

const GetCourseStatusDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetCourseStatusSuccessSchema);
const GetCourseStatusKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetCourseStatusNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const GetCourseStatusViewModelSchemaMap = {
    default: GetCourseStatusDefaultViewModelSchema,
    kaboom: GetCourseStatusKaboomViewModelSchema,
    notFound: GetCourseStatusNotFoundViewModelSchema,
};
export type TGetCourseStatusViewModelSchemaMap = typeof GetCourseStatusViewModelSchemaMap;
export const GetCourseStatusViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCourseStatusViewModelSchemaMap);
export type TGetCourseStatusViewModel = z.infer<typeof GetCourseStatusViewModelSchema>;
