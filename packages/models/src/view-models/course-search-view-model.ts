import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SearchCoursesSuccessResponseSchema } from '../usecase-models/search-courses-usecase-models';

export const CourseSearchSuccessSchema = SearchCoursesSuccessResponseSchema.shape.data;

export type TCourseSearchSuccess = z.infer<typeof CourseSearchSuccessSchema>;

const CourseSearchDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseSearchSuccessSchema);
const CourseSearchNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const CourseSearchKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const CourseSearchViewModelSchemaMap = {
    default: CourseSearchDefaultViewModelSchema,
    notFound: CourseSearchNotFoundViewModelSchema,
    kaboom: CourseSearchKaboomViewModelSchema,
};
export type TCourseSearchViewModelSchemaMap = typeof CourseSearchViewModelSchemaMap;
export const CourseSearchViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseSearchViewModelSchemaMap);
export type TCourseSearchViewModel = z.infer<typeof CourseSearchViewModelSchema>;
