import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetEnrolledCourseDetailsSuccessResponseSchema } from "@dream-aim-deliver/e-class-cms-rest";

export const EnrolledCourseDetailsSuccessSchema = GetEnrolledCourseDetailsSuccessResponseSchema.shape.data;

export type TEnrolledCourseDetailsSuccess = z.infer<typeof EnrolledCourseDetailsSuccessSchema>;

const EnrolledCourseDetailsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", EnrolledCourseDetailsSuccessSchema);
const EnrolledCourseDetailsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const EnrolledCourseDetailsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const EnrolledCourseDetailsUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const EnrolledCourseDetailsForbiddenViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("forbidden", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const EnrolledCourseDetailsViewModelSchemaMap = {
    default: EnrolledCourseDetailsDefaultViewModelSchema,
    kaboom: EnrolledCourseDetailsKaboomViewModelSchema,
    notFound: EnrolledCourseDetailsNotFoundViewModelSchema,
    unauthenticated: EnrolledCourseDetailsUnauthenticatedViewModelSchema,
    forbidden: EnrolledCourseDetailsForbiddenViewModelSchema
};
export type TEnrolledCourseDetailsViewModelSchemaMap = typeof EnrolledCourseDetailsViewModelSchemaMap;
export const EnrolledCourseDetailsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(EnrolledCourseDetailsViewModelSchemaMap);
export type TEnrolledCourseDetailsViewModel = z.infer<typeof EnrolledCourseDetailsViewModelSchema>;
