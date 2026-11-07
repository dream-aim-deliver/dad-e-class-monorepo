import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPackageGroupNoteTemplateSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPackageGroupNoteTemplateSuccessSchema = GetPackageGroupNoteTemplateSuccessResponseSchema.shape.data;
export type TGetPackageGroupNoteTemplateSuccess = z.infer<typeof GetPackageGroupNoteTemplateSuccessSchema>;

// Define view mode schemas
const GetPackageGroupNoteTemplateDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPackageGroupNoteTemplateSuccessSchema
);

const GetPackageGroupNoteTemplateKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPackageGroupNoteTemplateNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPackageGroupNoteTemplateViewModelSchemaMap = {
    default: GetPackageGroupNoteTemplateDefaultViewModelSchema,
    kaboom: GetPackageGroupNoteTemplateKaboomViewModelSchema,
    notFound: GetPackageGroupNoteTemplateNotFoundViewModelSchema,
};
export type TGetPackageGroupNoteTemplateViewModelSchemaMap = typeof GetPackageGroupNoteTemplateViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPackageGroupNoteTemplateViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPackageGroupNoteTemplateViewModelSchemaMap);
export type TGetPackageGroupNoteTemplateViewModel = z.infer<typeof GetPackageGroupNoteTemplateViewModelSchema>;
