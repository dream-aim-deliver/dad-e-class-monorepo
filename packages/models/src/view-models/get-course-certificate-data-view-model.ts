import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseCertificateDataSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetCourseCertificateDataSuccessSchema = GetCourseCertificateDataSuccessResponseSchema.shape.data;

export type TGetCourseCertificateDataSuccess = z.infer<typeof GetCourseCertificateDataSuccessSchema>;

const GetCourseCertificateDataDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetCourseCertificateDataSuccessSchema);
const GetCourseCertificateDataKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetCourseCertificateDataNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const GetCourseCertificateDataViewModelSchemaMap = {
    default: GetCourseCertificateDataDefaultViewModelSchema,
    kaboom: GetCourseCertificateDataKaboomViewModelSchema,
    notFound: GetCourseCertificateDataNotFoundViewModelSchema,
};
export type TGetCourseCertificateDataViewModelSchemaMap = typeof GetCourseCertificateDataViewModelSchemaMap;
export const GetCourseCertificateDataViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCourseCertificateDataViewModelSchemaMap);
export type TGetCourseCertificateDataViewModel = z.infer<typeof GetCourseCertificateDataViewModelSchema>;
