import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUserCoursesSuccessResponseSchema } from '../usecase-models/list-user-courses-usecase-models';

export const UserCourseListSuccessSchema = ListUserCoursesSuccessResponseSchema.shape.data;

export type TUserCourseListSuccess = z.infer<typeof UserCourseListSuccessSchema>;

const UserCourseListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", UserCourseListSuccessSchema);
const UserCourseListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const UserCourseListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const UserCourseListViewModelSchemaMap = {
    default: UserCourseListDefaultViewModelSchema,
    kaboom: UserCourseListKaboomViewModelSchema,
    notFound: UserCourseListNotFoundViewModelSchema,
};
export type TUserCourseListViewModelSchemaMap = typeof UserCourseListViewModelSchemaMap;
export const UserCourseListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UserCourseListViewModelSchemaMap);
export type TUserCourseListViewModel = z.infer<typeof UserCourseListViewModelSchema>;
