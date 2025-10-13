import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { EClassRoleSchema, GetCourseAccessSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetCourseAccessSuccessSchema = GetCourseAccessSuccessResponseSchema.shape.data.extend({
    highestRole: EClassRoleSchema.nullable(),
});

export type TGetCourseAccessSuccess = z.infer<typeof GetCourseAccessSuccessSchema>;

const GetCourseAccessDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetCourseAccessSuccessSchema);
const GetCourseAccessKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetCourseAccessNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetCourseAccessUnautheticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const GetCourseAccessViewModelSchemaMap = {
    default: GetCourseAccessDefaultViewModelSchema,
    kaboom: GetCourseAccessKaboomViewModelSchema,
    notFound: GetCourseAccessNotFoundViewModelSchema,
    unauthenticated: GetCourseAccessUnautheticatedViewModelSchema,
};
export type TGetCourseAccessViewModelSchemaMap = typeof GetCourseAccessViewModelSchemaMap;
export const GetCourseAccessViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCourseAccessViewModelSchemaMap);
export type TGetCourseAccessViewModel = z.infer<typeof GetCourseAccessViewModelSchema>;
