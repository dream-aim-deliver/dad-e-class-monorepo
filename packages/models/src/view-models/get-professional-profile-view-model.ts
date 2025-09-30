import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetProfessionalProfileSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetProfessionalProfileSuccessSchema = GetProfessionalProfileSuccessResponseSchema.shape.data;

export type TGetProfessionalProfileSuccess = z.infer<typeof GetProfessionalProfileSuccessSchema>;

const GetProfessionalProfileDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetProfessionalProfileSuccessSchema);
const GetProfessionalProfileKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetProfessionalProfileNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const GetProfessionalProfileViewModelSchemaMap = {
    default: GetProfessionalProfileDefaultViewModelSchema,
    kaboom: GetProfessionalProfileKaboomViewModelSchema,
    notFound: GetProfessionalProfileNotFoundViewModelSchema,
};
export type TGetProfessionalProfileViewModelSchemaMap = typeof GetProfessionalProfileViewModelSchemaMap;
export const GetProfessionalProfileViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetProfessionalProfileViewModelSchemaMap);
export type TGetProfessionalProfileViewModel = z.infer<typeof GetProfessionalProfileViewModelSchema>;
