import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SearchCoursesSuccessResponseSchema } from '../usecase-models/search-courses-usecase-models';

export const CourseSearchSuccessSchema = SearchCoursesSuccessResponseSchema.shape.data;

export type TCourseSearchSuccess = z.infer<typeof CourseSearchSuccessSchema>;

const CourseSearchDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseSearchSuccessSchema);
const CourseSearchNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const CourseSearchKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CourseSearchViewModelSchemaMap = {
    default: CourseSearchDefaultViewModelSchema,
    notFound: CourseSearchNotFoundViewModelSchema,
    kaboom: CourseSearchKaboomViewModelSchema,
};
export type TCourseSearchViewModelSchemaMap = typeof CourseSearchViewModelSchemaMap;
export const CourseSearchViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseSearchViewModelSchemaMap);
export type TCourseSearchViewModel = z.infer<typeof CourseSearchViewModelSchema>;
