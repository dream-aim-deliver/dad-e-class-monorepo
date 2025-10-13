import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetStudentDetailsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetStudentDetailsSuccessSchema = GetStudentDetailsSuccessResponseSchema.shape.data;

export type TGetStudentDetailsSuccess = z.infer<typeof GetStudentDetailsSuccessSchema>;

const GetStudentDetailsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetStudentDetailsSuccessSchema);
const GetStudentDetailsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetStudentDetailsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const GetStudentDetailsViewModelSchemaMap = {
    default: GetStudentDetailsDefaultViewModelSchema,
    "not-found": GetStudentDetailsNotFoundViewModelSchema,
    kaboom: GetStudentDetailsKaboomViewModelSchema,
};
export type TGetStudentDetailsViewModelSchemaMap = typeof GetStudentDetailsViewModelSchemaMap;

export const GetStudentDetailsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetStudentDetailsViewModelSchemaMap);
export type TGetStudentDetailsViewModel = z.infer<typeof GetStudentDetailsViewModelSchema>;
