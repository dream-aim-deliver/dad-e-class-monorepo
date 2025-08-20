import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from '../usecase-models/list-lesson-components-usecase-models';

export const LessonComponentListSuccessSchema = ListLessonComponentsSuccessResponseSchema.shape.data;

export type TLessonComponentListSuccess = z.infer<typeof LessonComponentListSuccessSchema>;

const LessonComponentListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", LessonComponentListSuccessSchema);
const LessonComponentListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory());
const LessonComponentListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());

export const LessonComponentListViewModelSchemaMap = {
    default: LessonComponentListDefaultViewModelSchema,
    notFound: LessonComponentListNotFoundViewModelSchema,
    kaboom: LessonComponentListKaboomViewModelSchema,
};
export type TLessonComponentListViewModelSchemaMap = typeof LessonComponentListViewModelSchemaMap;
export const LessonComponentListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(LessonComponentListViewModelSchemaMap);
export type TLessonComponentListViewModel = z.infer<typeof LessonComponentListViewModelSchema>;
