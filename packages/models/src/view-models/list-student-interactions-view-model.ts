import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListStudentInteractionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const ListStudentInteractionsSuccessSchema = ListStudentInteractionsSuccessResponseSchema.shape.data;

export type TListStudentInteractionsSuccess = z.infer<typeof ListStudentInteractionsSuccessSchema>;

const ListStudentInteractionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", ListStudentInteractionsSuccessSchema);
const ListStudentInteractionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const ListStudentInteractionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const ListStudentInteractionsViewModelSchemaMap = {
    default: ListStudentInteractionsDefaultViewModelSchema,
    kaboom: ListStudentInteractionsKaboomViewModelSchema,
    notFound: ListStudentInteractionsNotFoundViewModelSchema,
};
export type TListStudentInteractionsViewModelSchemaMap = typeof ListStudentInteractionsViewModelSchemaMap;
export const ListStudentInteractionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListStudentInteractionsViewModelSchemaMap);
export type TListStudentInteractionsViewModel = z.infer<typeof ListStudentInteractionsViewModelSchema>;