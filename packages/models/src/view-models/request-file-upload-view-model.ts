import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { RequestFileUploadSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const RequestFileUploadSuccessSchema = RequestFileUploadSuccessResponseSchema.shape.data;

export type TRequestFileUploadSuccess = z.infer<typeof RequestFileUploadSuccessSchema>;

const RequestFileUploadDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", RequestFileUploadSuccessSchema)
const RequestFileUploadKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const RequestFileUploadInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const RequestFileUploadViewModelSchemaMap = {
    default: RequestFileUploadDefaultViewModelSchema,
    kaboom: RequestFileUploadKaboomViewModelSchema,
    invalid: RequestFileUploadInvalidViewModelSchema,
};
export type TRequestFileUploadViewModelSchemaMap = typeof RequestFileUploadViewModelSchemaMap;
export const RequestFileUploadViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RequestFileUploadViewModelSchemaMap);
export type TRequestFileUploadViewModel = z.infer<typeof RequestFileUploadViewModelSchema>;