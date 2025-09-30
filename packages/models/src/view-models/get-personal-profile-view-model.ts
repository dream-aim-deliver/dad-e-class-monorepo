import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPersonalProfileSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const GetPersonalProfileSuccessSchema = GetPersonalProfileSuccessResponseSchema.shape.data;

export type TGetPersonalProfileSuccess = z.infer<typeof GetPersonalProfileSuccessSchema>;

const GetPersonalProfileDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", GetPersonalProfileSuccessSchema);
const GetPersonalProfileKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const GetPersonalProfileNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const GetPersonalProfileViewModelSchemaMap = {
    default: GetPersonalProfileDefaultViewModelSchema,
    kaboom: GetPersonalProfileKaboomViewModelSchema,
    notFound: GetPersonalProfileNotFoundViewModelSchema,
};
export type TGetPersonalProfileViewModelSchemaMap = typeof GetPersonalProfileViewModelSchemaMap;
export const GetPersonalProfileViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPersonalProfileViewModelSchemaMap);
export type TGetPersonalProfileViewModel = z.infer<typeof GetPersonalProfileViewModelSchema>;
