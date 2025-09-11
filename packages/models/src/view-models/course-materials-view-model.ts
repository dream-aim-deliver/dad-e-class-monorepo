import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import {
    ListCourseMaterialsSuccessResponseSchema,
} from '../usecase-models/list-course-materials-usecase-models';

export const CourseMaterialsListSuccessSchema = ListCourseMaterialsSuccessResponseSchema.shape.data;

export type TCourseMaterialsListSuccess = z.infer<typeof CourseMaterialsListSuccessSchema>;

const CourseMaterialsListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseMaterialsListSuccessSchema)
const CourseMaterialsListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const CourseMaterialsListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CourseMaterialsListViewModelSchemaMap = {
    default: CourseMaterialsListDefaultViewModelSchema,
    kaboom: CourseMaterialsListKaboomViewModelSchema,
    notFound: CourseMaterialsListNotFoundViewModelSchema,
};
export type TCourseMaterialsListViewModelSchemaMap = typeof CourseMaterialsListViewModelSchemaMap;
export const CourseMaterialsListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseMaterialsListViewModelSchemaMap);
export type TCourseMaterialsListViewModel = z.infer<typeof CourseMaterialsListViewModelSchema>;
