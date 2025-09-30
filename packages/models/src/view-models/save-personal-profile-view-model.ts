import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SavePersonalProfileSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const SavePersonalProfileSuccessSchema = SavePersonalProfileSuccessResponseSchema.shape.data;

export type TSavePersonalProfileSuccess = z.infer<typeof SavePersonalProfileSuccessSchema>;

const SavePersonalProfileDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SavePersonalProfileSuccessSchema);
const SavePersonalProfileKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const SavePersonalProfileNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const SavePersonalProfileViewModelSchemaMap = {
    default: SavePersonalProfileDefaultViewModelSchema,
    kaboom: SavePersonalProfileKaboomViewModelSchema,
    notFound: SavePersonalProfileNotFoundViewModelSchema,
};
export type TSavePersonalProfileViewModelSchemaMap = typeof SavePersonalProfileViewModelSchemaMap;
export const SavePersonalProfileViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SavePersonalProfileViewModelSchemaMap);
export type TSavePersonalProfileViewModel = z.infer<typeof SavePersonalProfileViewModelSchema>;
