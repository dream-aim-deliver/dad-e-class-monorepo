import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPublicCourseDetailsSuccessResponseSchema } from '../usecase-models/get-public-course-details-usecase-models';

export const PublicCourseDetailsSuccessSchema = GetPublicCourseDetailsSuccessResponseSchema.shape.data;

export type TPublicCourseDetailsSuccess = z.infer<typeof PublicCourseDetailsSuccessSchema>;

const PublicCourseDetailsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", PublicCourseDetailsSuccessSchema);
const PublicCourseDetailsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const PublicCourseDetailsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const PublicCourseDetailsViewModelSchemaMap = {
    default: PublicCourseDetailsDefaultViewModelSchema,
    kaboom: PublicCourseDetailsKaboomViewModelSchema,
    notFound: PublicCourseDetailsNotFoundViewModelSchema,
};
export type TPublicCourseDetailsViewModelSchemaMap = typeof PublicCourseDetailsViewModelSchemaMap;
export const PublicCourseDetailsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PublicCourseDetailsViewModelSchemaMap);
export type TPublicCourseDetailsViewModel = z.infer<typeof PublicCourseDetailsViewModelSchema>;
