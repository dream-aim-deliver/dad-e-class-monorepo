import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveProfessionalProfileSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const SaveProfessionalProfileSuccessSchema = SaveProfessionalProfileSuccessResponseSchema.shape.data;

export type TSaveProfessionalProfileSuccess = z.infer<typeof SaveProfessionalProfileSuccessSchema>;

const SaveProfessionalProfileDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SaveProfessionalProfileSuccessSchema);
const SaveProfessionalProfileKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const SaveProfessionalProfileNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const SaveProfessionalProfileViewModelSchemaMap = {
    default: SaveProfessionalProfileDefaultViewModelSchema,
    kaboom: SaveProfessionalProfileKaboomViewModelSchema,
    notFound: SaveProfessionalProfileNotFoundViewModelSchema,
};
export type TSaveProfessionalProfileViewModelSchemaMap = typeof SaveProfessionalProfileViewModelSchemaMap;
export const SaveProfessionalProfileViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveProfessionalProfileViewModelSchemaMap);
export type TSaveProfessionalProfileViewModel = z.infer<typeof SaveProfessionalProfileViewModelSchema>;
