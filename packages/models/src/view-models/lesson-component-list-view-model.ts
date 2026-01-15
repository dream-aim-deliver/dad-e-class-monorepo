import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const LessonComponentListSuccessSchema = ListLessonComponentsSuccessResponseSchema.shape.data;

export type TLessonComponentListSuccess = z.infer<typeof LessonComponentListSuccessSchema>;

const LessonComponentListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", LessonComponentListSuccessSchema);
const LessonComponentListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const LessonComponentListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const LessonComponentListViewModelSchemaMap = {
    default: LessonComponentListDefaultViewModelSchema,
    notFound: LessonComponentListNotFoundViewModelSchema,
    kaboom: LessonComponentListKaboomViewModelSchema,
};
export type TLessonComponentListViewModelSchemaMap = typeof LessonComponentListViewModelSchemaMap;
export const LessonComponentListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(LessonComponentListViewModelSchemaMap);
export type TLessonComponentListViewModel = z.infer<typeof LessonComponentListViewModelSchema>;
