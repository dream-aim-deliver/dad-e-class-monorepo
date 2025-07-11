import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetEnrolledCourseDetailsSuccessResponseSchema } from '../usecase-models/get-enrolled-course-details-usecase-models';

export const EnrolledCourseDetailsSuccessSchema = GetEnrolledCourseDetailsSuccessResponseSchema.shape.data;

export type TEnrolledCourseDetailsSuccess = z.infer<typeof EnrolledCourseDetailsSuccessSchema>;

const EnrolledCourseDetailsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", EnrolledCourseDetailsSuccessSchema);
const EnrolledCourseDetailsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());
const EnrolledCourseDetailsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory());
const EnrolledCourseDetailsUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory());
const EnrolledCourseDetailsForbiddenViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("forbidden", BaseErrorDataSchemaFactory());

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
