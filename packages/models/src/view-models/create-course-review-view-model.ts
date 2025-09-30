import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCourseReviewSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const CreateCourseReviewSuccessSchema = CreateCourseReviewSuccessResponseSchema.shape.data;

export type TCreateCourseReviewSuccess = z.infer<typeof CreateCourseReviewSuccessSchema>;

const CreateCourseReviewDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CreateCourseReviewSuccessSchema);
const CreateCourseReviewKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CreateCourseReviewNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CreateCourseReviewViewModelSchemaMap = {
    default: CreateCourseReviewDefaultViewModelSchema,
    kaboom: CreateCourseReviewKaboomViewModelSchema,
    notFound: CreateCourseReviewNotFoundViewModelSchema,
};
export type TCreateCourseReviewViewModelSchemaMap = typeof CreateCourseReviewViewModelSchemaMap;
export const CreateCourseReviewViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCourseReviewViewModelSchemaMap);
export type TCreateCourseReviewViewModel = z.infer<typeof CreateCourseReviewViewModelSchema>;
